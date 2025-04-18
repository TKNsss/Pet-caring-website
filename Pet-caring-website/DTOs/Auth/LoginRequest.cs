using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.Auth;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(8, ErrorMessage = "Passwords must have at least 8 characters.")]
    public string Password { get; set; } = null!;
}
