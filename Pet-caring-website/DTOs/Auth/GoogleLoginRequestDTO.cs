namespace Pet_caring_website.DTOs.Auth
{
    public class GoogleLoginRequestDTO
    {
        public string IdToken { get; set; } = null!; // Token xác thực từ Google
        public string Email { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Picture { get; set; }
    }
}
