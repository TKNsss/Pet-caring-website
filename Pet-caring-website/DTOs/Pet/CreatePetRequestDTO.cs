using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.Pet
{
    public class CreatePetRequestDTO
    {
        [Required(ErrorMessage = "Pet name is required")]   
        [StringLength(50, ErrorMessage = "Pet name cannot exceed 50 characters")]
        public string PetName { get; set; } = null!;

        [StringLength(50, ErrorMessage = "Breed cannot exceed 50 characters")]
        public string? Breed { get; set; }

        public short? SpcId { get; set; }

        [Required(ErrorMessage = "Age is required")]
        [Range(0, 300, ErrorMessage = "Age (months) must be between 0 and 300")]
        public short AgeInMonths { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        [RegularExpression("^(Male|Female)$", ErrorMessage = "Gender must be either 'Male' or 'Female'")]
        public string Gender { get; set; } = null!;

        [Required(ErrorMessage = "Weight is required")]
        [Range(0.1, 100, ErrorMessage = "Weight must be between 0.1 and 100 kg")]
        public decimal Weight { get; set; }

        [StringLength(500, ErrorMessage = "Notes cannot exceed 500 characters")]
        public string? Notes { get; set; }

        [StringLength(20)]
        [RegularExpression("^(Spayed|Neutered|None)$", ErrorMessage = "Status must be either 'spayed' or 'neutered', or 'none'.")]
        public string? Status { get; set; }

        public DateTime? AdoptDate { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string? AvatarUrl { get; set; }

        public IFormFile? AvatarImg { get; set; }
    }
}
