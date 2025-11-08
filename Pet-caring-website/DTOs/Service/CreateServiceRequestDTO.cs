using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.Service
{
    public class CreateServiceRequestDTO
    {
        [Required]
        [MaxLength(100)]
        public string ServiceName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string ServiceType { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public decimal? RatingStars { get; set; }
        public int? RatingCount { get; set; }
        public bool? IsActive { get; set; }
        public IEnumerable<string>? Keywords { get; set; }
    }
}
