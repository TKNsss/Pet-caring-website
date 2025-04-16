using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.User.PetProfile
{
    public class CreatePetRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn loại thú cưng.")]
        public short? SpcId { get; set; }

        [Required(ErrorMessage = "Tên thú cưng là bắt buộc.")]
        [StringLength(20, ErrorMessage = "Tên thú cưng tối đa 20 ký tự.")]
        public string PetName { get; set; } = null!;

        [StringLength(20, ErrorMessage = "Giống thú cưng tối đa 20 ký tự.")]
        public string? Breed { get; set; }

        [Required(ErrorMessage = "Tuổi của thú cưng là bắt buộc.")]
        [Range(0, 100, ErrorMessage = "Tuổi phải từ 0 đến 100.")]
        public short Age { get; set; }

        [Required(ErrorMessage = "Giới tính là bắt buộc.")]
        [StringLength(20, ErrorMessage = "Giới tính tối đa 20 ký tự.")]
        [RegularExpression("^(Male|Female)?$", ErrorMessage = "Giới tính chỉ được là 'Male' hoặc 'Female'")]
        public string Gender { get; set; } = null!;

        [Range(0.1, 100, ErrorMessage = "Cân nặng phải lớn hơn 0 và nhỏ hơn 100kg.")]
        public decimal Weight { get; set; }

        [StringLength(500, ErrorMessage = "Ghi chú tối đa 500 ký tự.")]
        public string? Notes { get; set; }
    }
}
