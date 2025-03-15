using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string email { get; set; } = null!;

        [Required]
        [MinLength(8)]
        public string password { get; set; } = null!;
    }
}
