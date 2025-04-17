namespace Pet_caring_website.DTOs.Pet
{
    public class UpdatePet
    {
        public string? PetName { get; set; }
        public string? Breed { get; set; }
        public short? Age { get; set; }
        public string? Gender { get; set; }
        public decimal? Weight { get; set; }
        public string? Notes { get; set; }
        public short? SpcId { get; set; }
    }
}
