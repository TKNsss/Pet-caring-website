namespace Pet_caring_website.DTOs.Auth;

public class AssignRoleRequest
{
    public required string Email { get; set; }
    public required string Role { get; set; }
}
