using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.Auth;

public class LoginRequestDTO
{
    [Required]
    [EmailAddress(ErrorMessage = "Invalid Email format.")]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(8, ErrorMessage = "Passwords must have at least 8 characters.")]
    public string Password { get; set; } = null!;
}
