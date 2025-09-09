using System.ComponentModel.DataAnnotations;

public class ResetPasswordRequestDTO
{
    [Required]
    [EmailAddress(ErrorMessage = "Invalid Email format.")]
    public string Email { get; set; } = null!;

    [Required]
    public string OtpCode { get; set; } = null!;
}