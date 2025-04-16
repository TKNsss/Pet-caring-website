using System.ComponentModel.DataAnnotations;
namespace Pet_caring_website.DTOs.User.UserProfile;
public class ChangePasswordRequest
{
    [Required(ErrorMessage = "Old password is required.")]
    public required string OldPassword { get; set; }

    [Required(ErrorMessage = "New password is required.")]
    [StringLength(80, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.")]
    public required string NewPassword { get; set; }
}
