using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs
{
    public class RegisterRequest
    {
        [Required]
        [MaxLength(50)]
        public string user_name { get; set; } = null!;

        [Required]
        [EmailAddress]
        [MaxLength(50)]
        public string email { get; set; } = null!;

        [Required]
        [MinLength(8, ErrorMessage = "Passwords must have at least 8 characters.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            ErrorMessage = "The password must contain at least one capital, a regular word, some and a special character.")]
        public string password { get; set; } = null!;

        [Required]
        [Compare("password", ErrorMessage = "The password confirms no match.")]
        public string confirm_password { get; set; } = null!;

    }
}
