using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.Pet
{
    public class UpdatePet
    {
        [StringLength(50, ErrorMessage = "Pet name cannot exceed 50 characters")]
        public string? PetName { get; set; }

        [StringLength(50, ErrorMessage = "Breed cannot exceed 50 characters")]
        public string? Breed { get; set; }

        [Range(0, 100, ErrorMessage = "Age must be between 0 and 100")]
        public short? Age { get; set; }

        public string? Gender { get; set; }

        [Range(0.1, 100, ErrorMessage = "Weight must be between 0.1 and 100 kg")]
        public decimal? Weight { get; set; }

        [StringLength(500, ErrorMessage = "Notes cannot exceed 500 characters")]
        public string? Notes { get; set; }
    }
}
