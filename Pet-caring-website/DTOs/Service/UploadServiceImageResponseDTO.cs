namespace Pet_caring_website.DTOs.Service
{
    public class UploadServiceImageResponseDTO
    {
        public short ServiceId { get; set; }
        public string ServiceImgUrl { get; set; } = string.Empty;
        public string PublicId { get; set; } = string.Empty;
    }
}
