using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Pet_caring_website.Interfaces
{
    public interface IImageService
    {
        Task<ImageUploadResult> UploadUserAvatarAsync(IFormFile file, string userId);
        Task<ImageUploadResult> UploadPetImageAsync(IFormFile file, string userId, int petId);
        Task<ImageUploadResult> UploadServiceImageAsync(IFormFile file, string userId, int serviceId);
        Task<DeletionResult> DeleteUserAvatarAsync(string userId);
        Task<DeletionResult> DeletePetImageAsync(string userId, int petId);
        Task<ImageUploadResult> UploadImageAsync(
            IFormFile file, 
            string folder, 
            string publicId, 
            string uploadPreset = "pcw-user-photos", 
            Transformation? transformation = null
        );
    }
}
