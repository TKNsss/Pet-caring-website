using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.User;

public class ChangePasswordRequestDTO
{
    [Required(ErrorMessage = "Old password is required.")]
    public string OldPassword { get; set; } = null!;

    [Required(ErrorMessage = "New password is required.")]
    [StringLength(80, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).")]
    public string NewPassword { get; set; } = null!;

    [Required(ErrorMessage = "Confirmed new password is required.")]
    [Compare("NewPassword", ErrorMessage = "The new password confirms does not match.")]
    public string NewConfirmedPassword { get; set; } = null!;   
}
