using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Pet_caring_website.DTOs.Pet;
using Pet_caring_website.Models;
using Pet_caring_website.Services;
using System.Security.Claims;

namespace Pet_caring_website.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PetsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ImageService _imageService;

        public PetsController(AppDbContext context, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // GET: api/v1/pets (get all pets)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetALlPets()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            var pets = await _context.PetOwners
                .Where(po => po.UserId == userId)
                .Select(po => new
                {
                    pet_id = po.Pet.PetId,
                    pet_name = po.Pet.PetName,
                    breed = po.Pet.Breed,
                    age = po.Pet.Age,
                    gender = po.Pet.Gender,
                    weight = po.Pet.Weight,
                    notes = po.Pet.Notes,
                    spc_id = po.Pet.SpcId
                })
                .ToListAsync();
            // .ToListAsync(): Executes the LINQ query asynchronously and returns the results as a List<>.
            return Ok(pets);
        }

        // GET api/v1/pets/5 (get specific pet)
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetPetById(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            // Find the pet with its owner info
            var petOwner = await _context.PetOwners
                .Include(po => po.Pet)
                .FirstOrDefaultAsync(po => po.PetId == id && po.UserId == userId);

            if (petOwner == null)
            {
                return NotFound(new { message = "Pet not found or you are not the owner" });
            }

            var pet = petOwner.Pet;

            return Ok(new
            {
                pet_id = pet.PetId,
                spc_id = pet.SpcId,
                pet_name = pet.PetName,
                breed = pet.Breed,
                age = pet.Age,
                gender = pet.Gender,
                weight = pet.Weight,
                notes = pet.Notes
            });
        }

        // POST api/v1/pets
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddPet([FromBody] CreatePet request)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var pet = new Pet
                {
                    SpcId = request.SpcId,
                    PetName = request.PetName,
                    Breed = request.Breed,
                    Age = request.Age,
                    Gender = request.Gender,
                    Weight = request.Weight,
                    Notes = request.Notes
                };

                await _context.Pets.AddAsync(pet);
                await _context.SaveChangesAsync(); // PetId is generated here

                var petOwner = new PetOwner
                {
                    PetId = pet.PetId,
                    UserId = userId
                };

                await _context.PetOwners.AddAsync(petOwner);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Pet created successfully",
                    pet = new
                    {
                        pet_id = pet.PetId,
                        spc_id = pet.SpcId,
                        pet_name = pet.PetName,
                        breed = pet.Breed,
                        age = pet.Age,
                        gender = pet.Gender,
                        weight = pet.Weight,
                        notes = pet.Notes
                    },      
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        // PATCH api/v1/pets/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdatePet(int id, [FromBody] UpdatePet request)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            // Check if the pet exists
            // The method first retrieves the pet based on the provided id. The Include(p => p.PetOwners) part
            // ensures that the related PetOwners are also retrieved. (like JOIN in sql)
            var pet = await _context.Pets
                .Where(p => p.PetId == id)
                .Include(p => p.PetOwners)  
                .FirstOrDefaultAsync();

            if (pet == null)
            {
                return NotFound(new { message = "Pet not found" });
            }

            // Check if the current user is the owner of the pet
            var petOwner = pet.PetOwners.FirstOrDefault(po => po.UserId == userId);

            if (petOwner == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized to update this pet" });
            }

            // Update fields that are provided
            if (request.PetName != null)
                pet.PetName = request.PetName;

            if (request.Breed != null)
                pet.Breed = request.Breed;  

            if (request.Age.HasValue)  
                pet.Age = request.Age.Value;         

            if (!string.IsNullOrEmpty(request.Gender))
                pet.Gender = request.Gender;      

            if (request.Weight.HasValue)
                pet.Weight = request.Weight.Value;

            if (request.Notes != null)          
                pet.Notes = request.Notes;                 

            try
            {
                // Save the updated pet to the database
                _context.Pets.Update(pet);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = "Pet updated successfully",
                    pet = new
                    {
                        pet_id = pet.PetId,
                        spc_id = pet.SpcId,
                        pet_name = pet.PetName,
                        breed = pet.Breed,
                        age = pet.Age,
                        gender = pet.Gender,
                        weight = pet.Weight,
                        notes = pet.Notes
                    },
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        // DELETE api/v1/pets/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePet(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            var petOwner = await _context.PetOwners
                .Include(po => po.Pet)
                .FirstOrDefaultAsync(po => po.PetId == id && po.UserId == userId);

            if (petOwner == null)
            {
                return NotFound(new { message = "Pet not found or you are not the owner" });
            }

            try
            {
                // These operations are sequential, and EF Core handles each with a SaveChangesAsync() call,
                // which internally wraps its commands in a transaction.
                _context.PetOwners.Remove(petOwner);
                _context.Pets.Remove(petOwner.Pet);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Pet deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpPost("upload-pet-image")]
        [Authorize]
        public async Task<IActionResult> UploadPetImage([FromForm(Name = "img")] IFormFile image, [FromQuery] string petId)
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { error = "No image file provided." });

            if (string.IsNullOrWhiteSpace(petId))
                return BadRequest(new { error = "Pet ID are required." });

            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
                {
                    return Unauthorized(new { message = "Bạn chưa đăng nhập" });
                }
                var result = await _imageService.UploadPetImageAsync(image, userId.ToString(), petId);

                return Ok(new
                {
                    message = "Pet image uploaded successfully.",
                    url = result.SecureUrl.ToString(),
                    publicId = result.PublicId
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Upload failed due to a server error.", details = ex.Message });
            }
        }
    }
}
