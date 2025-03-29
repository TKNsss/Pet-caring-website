using System.ComponentModel.DataAnnotations;
public class ResetPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string OtpCode { get; set; } = null!;

    [Required]
    [StringLength(80, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "The password must contain at least one capital, a regular word, some and a special character.")]
    public string NewPassword { get; set; } = null!;
}

