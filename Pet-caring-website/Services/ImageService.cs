using System.Net;
using CloudinaryDotNet; // gives access to Cloudinary, Account, FileDescription, etc
using CloudinaryDotNet.Actions; // includes action result types like ImageUploadResult
using Pet_caring_website.Interfaces;
// This service handles uploading images to Cloudinary using files that come in through
// a web form (usually via multipart/form-data).

namespace Pet_caring_website.Services
{
    public class ImageService : IImageService
    {
        // inject the Cloudinary client that was registered in Program.cs
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<ImageService> _logger;

        public ImageService(Cloudinary cloudinary, ILogger<ImageService> logger)
        {
            _cloudinary = cloudinary;
            _logger = logger;
        }

        // IFormFile file: This represents the image uploaded from a form
        // (e.g., from an HTML <input type="file">).
        public async Task<ImageUploadResult> UploadUserAvatarAsync(IFormFile file, string userId)
        {
            var folder = "pcw/user";
            var publicId = $"{userId}/avatar"; // image name will be set to avatar.png,...

            _logger.LogInformation("[ImageService] Uploading user avatar for UserId={UserId}", userId);
            return await UploadImageAsync(file, folder, publicId, "pcw-user-photos");
        }

        public async Task<ImageUploadResult> UploadPetImageAsync(IFormFile file, string userId, int petId)
        {
            var folder = "pcw/pets"; // separate pets per user
            var publicId = $"{userId}/{petId}";
            // pet image will just use petId as name

            _logger.LogInformation("[ImageService] Uploading pet image | UserId={UserId}, PetId={PetId}", userId, petId);
            return await UploadImageAsync(file, folder, publicId, "pcw-user-photos");
        }

        public async Task<ImageUploadResult> UploadServiceImageAsync(IFormFile file, string userId, int serviceId)
        {
            var folder = "pcw/services";
            var publicId = $"{userId}/{serviceId}";

            _logger.LogInformation("[ImageService] Uploading service image | UserId={UserId}, ServiceId={ServiceId}", userId, serviceId);
            return await UploadImageAsync(file, folder, publicId, "pcw-user-photos");
        }

        public async Task<DeletionResult> DeleteUserAvatarAsync(string userId)
        {
            var publicId = $"pcw/user/{userId}/avatar";
            _logger.LogInformation("[ImageService] Deleting user avatar | UserId={UserId}, PublicId={PublicId}", userId, publicId);

            return await DeleteImageAsync(publicId);
        }

        public async Task<DeletionResult> DeletePetImageAsync(string userId, int petId)
        {
            var publicId = $"pcw/pets/{userId}/{petId}"; // must match upload path
            _logger.LogInformation("[ImageService] Deleting pet image | UserId={UserId}, PetId={PetId}, PublicId={PublicId}", userId, petId, publicId);

            return await DeleteImageAsync(publicId);
        }

        // ImageUploadResult, which includes metadata like URL, public ID, size, etc.
        public async Task<ImageUploadResult> UploadImageAsync(
            IFormFile file,
            string folder,
            string publicId,
            string uploadPreset = "pcw-user-photos",
            Transformation? transformation = null)
        {
            try
            {
                ValidateImage(file);
                await using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folder,
                    PublicId = publicId,
                    UploadPreset = uploadPreset,
                    Overwrite = true, // overwrite existing image with same publicId
                    Invalidate = true, // ensure old version in CDN cache is cleared and a new one served
                    Transformation = transformation ?? new Transformation()
                        .Width(300)
                        .Height(300)
                        .Crop("fill") // Crops the image to fit the exact dimensions while keeping subject in focus
                        .Gravity("face") // Focuses crop on face if detected
                        .FetchFormat("auto") // Converts to most efficient format automatically
                        .Quality("auto:eco") // Compresses to "eco" level - smaller file size with reasonable quality
                };

                _logger.LogInformation("[ImageService] Uploading image to Cloudinary | PublicId={PublicId}, Folder={Folder}", publicId, folder);

                var result = await _cloudinary.UploadAsync(uploadParams);

                var statusNotOk = result.StatusCode != HttpStatusCode.OK;
                var hasError = result.Error != null;
                var missingUrl = result.SecureUrl == null;

                if (statusNotOk || hasError || missingUrl)
                {
                    var errorMessage = result.Error?.Message ?? $"Upload failed with status {result.StatusCode}";
                    _logger.LogWarning("[ImageService] Upload failed | Status={Status}, MissingUrl={MissingUrl}, Error={Error}", result.StatusCode, missingUrl, result.Error?.Message);
                    throw new InvalidOperationException(errorMessage);
                }

                return result;
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "[ImageService] Error uploading image: {Message}", ex.Message);
                throw; // rethrow to be handled by the caller
            }
        }

        private async Task<DeletionResult> DeleteImageAsync(string publicId)
        {
            try
            {
                var deletionParams = new DeletionParams(publicId)
                {
                    // ensure deleting an image (not video, raw file, etc)
                    ResourceType = ResourceType.Image
                };

                _logger.LogInformation("[ImageService] Sending delete request to Cloudinary | PublicId={PublicId}", publicId);

                var result = await _cloudinary.DestroyAsync(deletionParams); // call Cloudinary's Destroy API to delete the img
                
                // Cloudinary returns a DeletionResult with:
                //    - result.Result: "ok", "not found", etc.
                //    - result.StatusCode
                //    - result.Error?.Message if any error
                if (result.Result != "ok")
                {
                    _logger.LogWarning("[ImageService] Deletion may have failed on Cloudinary | PublicId={PublicId}, Result={Result}, Error={Error}",
                        publicId, result.Result, result.Error?.Message);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ImageService] Error deleting image on Cloudinary | PublicId={PublicId}, Error={Message}", publicId, ex.Message);
                throw; // Let controller decide how to translate to HTTP response
            }
        }

        private void ValidateImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new InvalidOperationException("No image file provided.");

            if (file.Length > 2 * 1024 * 1024)
                throw new InvalidOperationException("Max allowed size of image is 2 MB");

            var validTypes = new[] { "image/jpeg", "image/png", "image/jpg" };

            if (!validTypes.Contains(file.ContentType))
                throw new InvalidOperationException("Unsupported image type. Only JPEG, PNG, and JPG are allowed.");
        }
    }
}
