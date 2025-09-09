namespace Pet_caring_website.DTOs.Pet
{
    public class UploadPetImageResponseDTO
    {
        public Guid UserId { get; set; }
        public int PetId { get; set; }
        public string AvatarUrl { get; set; } = null!;
        public string PublicId { get; set; } = null!;
    }
}
