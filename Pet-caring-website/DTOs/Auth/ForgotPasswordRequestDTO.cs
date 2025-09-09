using System.ComponentModel.DataAnnotations;

public class ForgotPasswordRequestDTO
{
    [Required]
    [EmailAddress(ErrorMessage = "Invalid Email format.")]
    public string Email { get; set; } = null!;
}
