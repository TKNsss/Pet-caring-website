using System.ComponentModel.DataAnnotations;
namespace Pet_caring_website.DTOs.Auth;

public class AssignRoleRequest
{
    [EmailAddress]
    public required string Email { get; set; }
    public required string Role { get; set; }
}
