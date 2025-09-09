using Pet_caring_website.DTOs.User;

namespace Pet_caring_website.DTOs.Auth
{
    public class AuthResponseDTO
    {
        public string Message { get; set; } = null!;
        public string Token { get; set; } = null!;
        public UserInfoDTO? User { get; set; }
    }
}
