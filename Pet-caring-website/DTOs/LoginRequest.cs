using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string email { get; set; } = null!;

        [Required]
        [MinLength(8, ErrorMessage = "Passwords must have at least 8 characters.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            ErrorMessage = "The password must contain at least one capital, a regular word, some and a special character.")]
        public string password { get; set; } = null!;
    }
}
