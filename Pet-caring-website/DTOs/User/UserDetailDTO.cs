namespace Pet_caring_website.DTOs.User
{
    public class UserDetailDTO
    {
        public Guid UserId { get; set; }
        public string? Username { get; set; }
        public string Email { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Speciality { get; set; } // Only for users with role "vet"
    }
}
