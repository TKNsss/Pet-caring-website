using System.ComponentModel.DataAnnotations;
public class ResetPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string OtpCode { get; set; } = null!;
}

