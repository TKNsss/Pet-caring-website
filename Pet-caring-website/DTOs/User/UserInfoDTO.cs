namespace Pet_caring_website.DTOs.User
{
    public class UserInfoDTO
    {
        public Guid UserId { get; set; }
        public string? Username { get; set; }
        public string Email { get; set; } = null!;
    }
}
