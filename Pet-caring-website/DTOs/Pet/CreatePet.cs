using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.Pet
{
    public class CreatePet
    {
        public short? SpcId { get; set; }

        [Required(ErrorMessage = "Pet name is required")]
        [StringLength(20, ErrorMessage = "Pet name cannot exceed 20 characters")]
        public string PetName { get; set; } = null!;

        [StringLength(50, ErrorMessage = "Breed cannot exceed 50 characters")]
        public string? Breed { get; set; }

        [Required(ErrorMessage = "Age is required")]
        [Range(0, 100, ErrorMessage = "Age must be between 0 and 100")]
        public short Age { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        [RegularExpression("^(Male|Female)$", ErrorMessage = "Gender must be either 'Male' or 'Female'")]
        public string Gender { get; set; } = null!;

        [Required(ErrorMessage = "Weight is required")]
        [Range(0.1, 100, ErrorMessage = "Weight must be between 0.1 and 100 kg")]
        public decimal Weight { get; set; }

        [StringLength(500, ErrorMessage = "Notes cannot exceed 500 characters")]
        public string? Notes { get; set; }
    }
}
