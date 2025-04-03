using System.ComponentModel.DataAnnotations;

public class ForgotPasswordRequest
{
    [EmailAddress]
    public required string Email { get; set; }
}
