using System.ComponentModel.DataAnnotations;
namespace Pet_caring_website.DTOs.Auth;

public class SendOtpRequest
{
        [EmailAddress]
        public required string Email { get; set; }
}
