namespace Pet_caring_website.DTOs.Pet
{
    public class PetResponseDTO
    {
        public int PetId { get; set; }
        public string? PetName { get; set; }
        public string? Breed { get; set; }
        public short? AgeInMonths { get; set; }
        public string? Gender { get; set; }
        public decimal? Weight { get; set; }
        public string? Notes { get; set; }
        public string? Status { get; set; }
        public DateOnly? AdoptDate { get; set; }
        public short? SpcId { get; set; }
        public string? SpcName { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
