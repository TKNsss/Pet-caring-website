using System.ComponentModel.DataAnnotations;
<<<<<<< HEAD:Pet-caring-website/DTOs/User/UpdateProfileRequest.cs

namespace Pet_caring_website.DTOs.User
=======
namespace Pet_caring_website.DTOs.User.UserProfile
>>>>>>> origin/backend-authentication:Pet-caring-website/DTOs/User/UserProfile/UpdateProfileRequest.cs
{
    public class UpdateProfileRequest
    {
        [StringLength(50, ErrorMessage = "Username cannot exceed 50 characters.")]
        public string? UserName {  get; set; }

        [StringLength(50, ErrorMessage = "Username cannot exceed 50 characters.")]
        public string? FirstName { get; set; }

        [StringLength(50, ErrorMessage = "Username cannot exceed 50 characters.")]
        public string? LastName { get; set; }

        [StringLength(10)]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must have 10 digits.")]
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Speciality { get; set; } // Chỉ dành cho user có role là "vet"
    }
}
    