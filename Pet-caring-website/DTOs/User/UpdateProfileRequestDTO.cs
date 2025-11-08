using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.User
{
    public class UpdateProfileRequestDTO
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
    