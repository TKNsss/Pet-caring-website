using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.Auth;

public class RegisterRequestDTO
{
    [Required]
    [StringLength(50, ErrorMessage = "User name must not exceed 50 characters.")]
    public string UserName { get; set; } = null!;

    [Required]
    [StringLength(30, ErrorMessage = "Email must not exceed 30 characters.")]
    [EmailAddress(ErrorMessage = "Invalid Email format.")]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(80, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "The password must contain at least one capital, a regular word, some and a special character (@$!%*?&).")]
    public string Password { get; set; } = null!;

    [Required]
    [Compare("Password", ErrorMessage = "The password confirms does not match.")]
    public string ConfirmPassword { get; set; } = null!;

    public string? OtpCode { get; set; }  // Người dùng nhập OTP sau khi nhận email
}
