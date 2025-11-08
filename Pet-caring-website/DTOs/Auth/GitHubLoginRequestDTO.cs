namespace Pet_caring_website.DTOs.Auth
{
    public class GitHubLoginRequestDTO
    {
        public string Code { get; set; } = null!; // Mã xác thực từ GitHub
        public string? State { get; set; } // Trạng thái để bảo vệ chống lại các cuộc tấn công CSRF
    }
}
