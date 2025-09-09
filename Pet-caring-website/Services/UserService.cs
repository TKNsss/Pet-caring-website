using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Pet_caring_website.DTOs.User;
using Pet_caring_website.Helpers;
using Pet_caring_website.Interfaces;

namespace Pet_caring_website.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IUserContextService _userContext;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public UserService(AppDbContext context, IUserContextService userContext, IImageService imageService, IMapper mapper)
        {
            _context = context;
            _userContext = userContext;
            _imageService = imageService;
            _mapper = mapper;
        }

        public async Task<UserDetailDTO> GetUserProfileAsync()
        {
            _userContext.EnsureAuthenticated();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == _userContext.UserId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            return _mapper.Map<UserDetailDTO>(user);
        }

        public async Task<UserDetailDTO> UpdateUserProfileAsync(UpdateProfileRequestDTO request)
        {
            _userContext.EnsureAuthenticated();

            var user = await _context.Users.FindAsync(_userContext.UserId) 
                ?? throw new KeyNotFoundException("User not found.");

            // Only update provided fields
            if (request.UserName != null) user.UserName = request.UserName.Trim();
            if (request.FirstName != null) user.FirstName = request.FirstName.Trim();
            if (request.LastName != null) user.LastName = request.LastName.Trim();
            if (request.Phone != null) user.Phone = request.Phone.Trim();
            if (request.Address != null) user.Address = request.Address.Trim();
            if (user.Role?.ToLower() == "vet" && request.Speciality != null)
            {
                user.Speciality = request.Speciality.Trim();
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDetailDTO>(user);
        }

        public async Task ChangePasswordAsync(ChangePasswordRequestDTO request)
        {
            _userContext.EnsureAuthenticated();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == _userContext.UserId) 
                ?? throw new KeyNotFoundException("User not found.");

            if (user.Password == null)
                throw new InvalidOperationException("You don't have a password. Please forget the password to add it.");

            if (!PasswordHandler.VerifyPassword(request.OldPassword, user.Password))
                throw new ArgumentException("Old password is not correct.");

            if (request.OldPassword == request.NewPassword)
                throw new ArgumentException("New password can't be the same as the old one.");

            user.Password = PasswordHandler.HashPassword(request.NewPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<UploadAvatarResponseDTO> UploadAvatarAsync(IFormFile image)
        {
            _userContext.EnsureAuthenticated();

            if (image == null || image.Length == 0)
                throw new ArgumentException("No image file provided.");

            var userId = _userContext.UserId!.Value; // Safe to use now

            var result = await _imageService.UploadUserAvatarAsync(image, userId.ToString());
            if (result == null)
                throw new InvalidOperationException("Error uploading avatar. Please try again later.");

            var user = await _context.Users.FindAsync(_userContext.UserId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            user.AvatarUrl = result.SecureUrl.ToString();
            await _context.SaveChangesAsync();

            return new UploadAvatarResponseDTO
            {            
                UserId = user.UserId,
                AvatarUrl = result.SecureUrl.ToString(),
                PublicId = result.PublicId
            };
        }
    }
}
