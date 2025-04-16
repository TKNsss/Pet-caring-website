using System.ComponentModel.DataAnnotations;
namespace Pet_caring_website.DTOs.User.UserProfile
{
    public class UpdateProfileRequest
    {
        public string? UserName {  get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Speciality { get; set; } // Chỉ dành cho user có role là "vet"
    }
}
    