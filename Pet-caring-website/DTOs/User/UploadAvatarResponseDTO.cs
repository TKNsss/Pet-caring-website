namespace Pet_caring_website.DTOs.User
{
    public class UploadAvatarResponseDTO
    {
        public Guid UserId { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public string PublicId { get; set; } = string.Empty;
    }
}
