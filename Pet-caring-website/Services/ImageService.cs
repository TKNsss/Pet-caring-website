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

        // ImageUploadResult, which includes metadata like URL, public ID, size, etc.
        private async Task<ImageUploadResult> UploadImageAsync(
            IFormFile file,
            string uploadPreset,
            string folder,
            string publicId,
            Transformation transformation = null)
        {
            ValidateImage(file);

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                UploadPreset = uploadPreset,
                Folder = folder,
                PublicId = publicId,
                Transformation = transformation ?? new Transformation()
                    .Width(300)
                    .Height(300)
                    .Crop("fill") // Crops the image to fit the exact dimensions while keeping subject in focus
                    .Gravity("face") // Focuses crop on face if detected
                    .FetchFormat("auto") // Converts to most efficient format automatically
                    .Quality("auto:eco") // Compresses to "eco" level — smaller file size with reasonable quality
            };

            return await _cloudinary.UploadAsync(uploadParams);
        }

        // IFormFile file: This represents the image uploaded from a form
        // (e.g., from an HTML <input type="file">).
        public async Task<ImageUploadResult> UploadUserAvatarAsync(IFormFile file, string userId)
        {
            var folder = "pcw/user";
            var publicId = $"{userId}/avatar"; // image name will be set to avatar.png,...

            return await UploadImageAsync(file, "pcw-user-photos", folder, publicId);
        }

        public async Task<ImageUploadResult> UploadPetImageAsync(IFormFile file, string userId, int petId)
        {
            var folder = "pcw/pets"; // separate pets per user
            var publicId = $"{userId}/{petId}";
            // pet image will just use petId as name

            return await UploadImageAsync(file, "pcw-user-photos", folder, publicId);
        }

        private void ValidateImage(IFormFile file)
        {
            if (file.Length > 2 * 1024 * 1024)
                throw new InvalidOperationException("Max allowed size of image is 2 MB");          

            var validTypes = new[] { "image/jpeg", "image/png", "image/jpg"};

            if (!validTypes.Contains(file.ContentType))
                throw new InvalidOperationException("Unsupported image type. Only JPEG, PNG, and JPG are allowed.");
        }
    }
}
