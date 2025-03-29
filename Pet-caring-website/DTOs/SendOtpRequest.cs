using System.ComponentModel.DataAnnotations;
namespace Pet_caring_website.DTOs
{
	public class SendOtpRequest
	{
        [EmailAddress]
        public required string Email { get; set; }
	}
}
