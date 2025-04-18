using CloudinaryDotNet; // gives access to Cloudinary, Account, FileDescription, etc
using CloudinaryDotNet.Actions; // includes action result types like ImageUploadResult

// This service handles uploading images to Cloudinary using files that come in through
// a web form (usually via multipart/form-data).

namespace Pet_caring_website.Services
{
    public class ImageService
    {
        // inject the Cloudinary client that was registered in Program.cs
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;

        public ImageService(CloudinaryDotNet.Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }

        // IFormFile file: This represents the image uploaded from a form
        // (e.g., from an HTML <input type="file">).
        // ImageUploadResult, which includes metadata like URL, public ID, size, etc.
        public async Task<ImageUploadResult> UploadUserAvatarAsync(IFormFile file, string userId)
        {
            ValidateImage(file);

            await using var stream = file.OpenReadStream();

            // Asset folder: pcw/user -> pcw/user/userId/avatar
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                UploadPreset = "pcw-user-photos",
                PublicId = $"{userId}/avatar", // image name will be set to avatar.png,...
                Transformation = new Transformation()
                    .Width(300)
                    .Height(300)
                    .Crop("fill") // Crops the image to fit the exact dimensions while keeping subject in focus
                    .Gravity("face") // Focuses crop on face if detected 
                    .FetchFormat("auto") // Converts to most efficient format automatically
                    .Quality("auto:eco") // Compresses to "eco" level — smaller file size with reasonable quality
            };

            return await _cloudinary.UploadAsync(uploadParams);
        }

        public async Task<ImageUploadResult> UploadPetImageAsync(IFormFile file, string userId, string petId)
        {
            ValidateImage(file);

            await using var stream = file.OpenReadStream();

            // The folder will be named after the userId and petId, e.g., "pets/12345/pet123/image.jpg"
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                PublicId = $"pcw/{userId}/pets/{petId}",  // Pet image for the specific user and pet
                Transformation = new Transformation()
                    .Width(300)
                    .Height(300)
                    .Crop("fill") 
                    .Gravity("face") 
                    .FetchFormat("auto") 
                    .Quality("auto:eco") 
            };

            return await _cloudinary.UploadAsync(uploadParams);
        }

        private void ValidateImage(IFormFile file)
        {
            if (file.Length > 2 * 1024 * 1024)
                throw new InvalidOperationException("Max allowed size of image is 2 MB");          

            var validTypes = new[] { "image/jpeg", "image/png", "image/jpg"};

            if (!validTypes.Contains(file.ContentType))
                throw new InvalidOperationException("Unsupported image type. Only JPEG, PNG, and JPG are allowed.");
        }

        public string GetAvatarUrl(string userId)
        {
            var avatarUrl = _cloudinary.Api.UrlImgUp
                .BuildUrl($"avatars/{userId}/avatar.jpg"); // Adjust the publicId based on your folder structure
            return avatarUrl;
        }

        public string GetPetImageUrl(string userId, string petId)
        {
            var petImageUrl = _cloudinary.Api.UrlImgUp
                .BuildUrl($"pets/{userId}/{petId}/image.jpg"); // Adjust the publicId based on your folder structure
            return petImageUrl;
        }
    }
}
