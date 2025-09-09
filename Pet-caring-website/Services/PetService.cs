using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Pet_caring_website.DTOs.Pet;
using Pet_caring_website.Interfaces;
using Pet_caring_website.Models;

namespace Pet_caring_website.Services
{
    public class PetService : IPetService
    {
        private readonly AppDbContext _context;
        private readonly IUserContextService _userContext;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;
        private readonly ILogger<PetService> _logger;

        public PetService(AppDbContext context, IUserContextService userContext, IImageService image, IMapper mapper, ILogger<PetService> logger)
        {
            _context = context;
            _userContext = userContext;
            _imageService = image;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<PetResponseDTO>> GetAllPetsByUserAsync()
        {
            _userContext.EnsureAuthenticated();
            var userId = _userContext.UserId!.Value;

            var pets = await _context.PetOwners
                .Where(po => po.UserId == userId)
                .Include(po => po.Pet)
                    .ThenInclude(p => p.Species)
                .Select(po => po.Pet)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PetResponseDTO>>(pets);
        }

        public async Task<PetResponseDTO> GetPetByIdAsync(int petId)
        {
            _userContext.EnsureAuthenticated();
            var userId = _userContext.UserId!.Value;

            var pet = await _context.PetOwners
                .Where(po => po.UserId == userId && po.PetId == petId)
                .Include(po => po.Pet)
                    .ThenInclude(p => p.Species)
                .Select(po => po.Pet)
                .FirstOrDefaultAsync();

            if (pet == null)
                throw new KeyNotFoundException("Pet not found or you do not have permission to access it.");

            return _mapper.Map<PetResponseDTO>(pet);
        }
        
        public async Task<PetResponseDTO> CreatePetAsync(CreatePetRequestDTO request)
        {
            _userContext.EnsureAuthenticated();
            var userId = _userContext.UserId!.Value;

            if (request.AdoptDate.HasValue && request.AdoptDate.Value > DateTime.UtcNow)
            {
                throw new ArgumentException("Adopt date cannot be in the future.");
            }

            var petName = request.PetName.Trim();
            var breed = request.Breed?.Trim() ?? "";

            var duplicatePet = await _context.Pets.FirstOrDefaultAsync(p =>
                EF.Functions.ILike(p.PetName, petName) &&
                EF.Functions.ILike(p.Breed ?? "", breed) &&
                p.Gender == request.Gender &&
                p.AgeInMonths == request.AgeInMonths &&
                p.SpcId == request.SpcId
            );

            if (duplicatePet != null)
                throw new ArgumentException("Pet with the same information already exists.");

            await using var transaction = await _context.Database.BeginTransactionAsync();

            var pet = _mapper.Map<Pet>(request);
            await _context.Pets.AddAsync(pet);
            await _context.SaveChangesAsync();
            
            var petOwner = new PetOwner
            {
                PetId = pet.PetId,  
                UserId = userId
            };
            await _context.PetOwners.AddAsync(petOwner);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return _mapper.Map<PetResponseDTO>(pet);
        }

        public async Task<PetResponseDTO> UpdatePetAsync(int petId, UpdatePetRequestDTO request)
        {
            _userContext.EnsureAuthenticated();
            var userId = _userContext.UserId!.Value;

            // Validate adopt date before updating
            if (request.AdoptDate.HasValue && request.AdoptDate.Value > DateTime.UtcNow)
            {
                throw new ArgumentException("Adopt date cannot be in the future.");
            }

            // Check if the pet exists
            // The method first retrieves the pet based on the provided id. The Include(p => p.PetOwners) part
            // ensures that the related PetOwners are also retrieved. (like JOIN in sql)
            var pet = await _context.Pets
                .Where(p => p.PetId == petId)
                .Include(p => p.PetOwners)
                .FirstOrDefaultAsync();

            if (pet == null)
                throw new KeyNotFoundException("Pet not found");

            // Check if the current user is the owner of the pet
            var isOwner = pet.PetOwners.Any(po => po.UserId == userId);
            if (!isOwner)
                throw new UnauthorizedAccessException("You are not authorized to update this pet");

            // Map only provided fields
            _mapper.Map(request, pet);

            await _context.SaveChangesAsync();

            return _mapper.Map<PetResponseDTO>(pet);
        }

        public async Task<int> DeletePetAsync(int petId)
        {
            _userContext.EnsureAuthenticated();
            var userId = _userContext.UserId!.Value;

            var petOwner = await _context.PetOwners
                .Include(po => po.Pet)
                .FirstOrDefaultAsync(po => po.PetId == petId && po.UserId == userId);

            if (petOwner == null)
                throw new KeyNotFoundException("Pet not found or you are not the owner.");

            _context.PetOwners.Remove(petOwner);
            _context.Pets.Remove(petOwner.Pet);
            await _context.SaveChangesAsync();

            var result = await _imageService.DeletePetImageAsync(userId.ToString(), petId);

            if (result.Result != "ok" && result.Result != "not found")
            {
                _logger.LogWarning(
                    "[PetsController] Pet deleted in DB but Cloudinary deletion issue | UserId={UserId}, PetId={PetId}, CloudinaryResult={Result}, Error={Error}",
                    userId, petId, result.Result, result.Error?.Message
                );
            }

            return petId;
        }

        public async Task<UploadPetImageResponseDTO> UploadPetImageAsync(IFormFile image, int petId)
        {
            _userContext.EnsureAuthenticated();
            var userId = _userContext.UserId!.Value;

            if (image == null || image.Length == 0)
                throw new ArgumentException("No image file provided.");

            // Check if pet exists and belongs to the user
            var petOwner = await _context.PetOwners
                .Include(po => po.Pet)
                .FirstOrDefaultAsync(po => po.PetId == petId && po.UserId == userId);

            if (petOwner == null)
                throw new KeyNotFoundException("Pet not found or you are not the owner.");

            var result = await _imageService.UploadPetImageAsync(image, userId.ToString(), petId);

            if (result == null)
                throw new InvalidOperationException("Error uploading pet image. Please try again later.");

            var pet = petOwner.Pet!;
            pet.AvatarUrl = result.SecureUrl.ToString();
            await _context.SaveChangesAsync();

            return new UploadPetImageResponseDTO
            {       
                UserId = userId,
                PetId = petId,
                AvatarUrl = pet.AvatarUrl!,
                PublicId = result.PublicId
            };
        }
    }
}
