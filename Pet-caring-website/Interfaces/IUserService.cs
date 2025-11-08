using Pet_caring_website.DTOs.User;

namespace Pet_caring_website.Interfaces
{
    public interface IUserService
    {
        Task<UserDetailDTO> GetUserProfileAsync();
        Task<UserDetailDTO> UpdateUserProfileAsync(UpdateProfileRequestDTO request);
        Task ChangePasswordAsync(ChangePasswordRequestDTO request);
        Task<UploadAvatarResponseDTO> UploadAvatarAsync(IFormFile image);
    }
}
