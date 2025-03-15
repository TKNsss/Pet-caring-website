using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pet_caring_website.Models
{
    public class Users
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid user_id { get; set; } = Guid.NewGuid(); // Tự động tạo UUID khi khởi tạo User mới

        [Required]
        [MaxLength(50)]
        public required string user_name { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(50)]
        public required string email { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(50)]
        public required string password { get; set; }

        [Required]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Số điện thoại phải có 10 chữ số")]
        public required string phone { get; set; }

        [Required]
        [MaxLength(255)]
        public required string address { get; set; }

        [Required]
        public bool is_admin { get; set; } = false;
    }
}
