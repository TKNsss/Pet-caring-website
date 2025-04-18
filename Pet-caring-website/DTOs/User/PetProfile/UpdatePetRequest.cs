using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.User.PetProfile
{
    public class UpdatePetRequest
    {
        [StringLength(20, ErrorMessage = "Tên thú cưng tối đa 20 ký tự")]
        public string? PetName { get; set; }

        [StringLength(20, ErrorMessage = "Giống thú cưng tối đa 20 ký tự")]
        public string? Breed { get; set; }

        [Range(0, 100, ErrorMessage = "Tuổi phải từ 0 đến 100")]
        public short? Age { get; set; }

        public string? Gender { get; set; }

        [Range(0.1, 100, ErrorMessage = "Cân nặng phải từ 0.1 đến 100 kg")]
        public decimal? Weight { get; set; }

        [StringLength(255, ErrorMessage = "Ghi chú tối đa 255 ký tự")]
        public string? Notes { get; set; }


    }
}
