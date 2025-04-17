using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.User.Appointment
{
    public class AppointmentResponse
    {
        public int AppointmentId { get; set; } // ID của cuộc hẹn
        public string Status { get; set; } = string.Empty; // Trạng thái của cuộc hẹn
        public DateTime ApDate { get; set; } // Ngày hẹn
        public string? Notes { get; set; } // Ghi chú
        public DateTime CreateAt { get; set; } // Thời gian tạo

        // Danh sách các dịch vụ trong cuộc hẹn
        public List<AppointmentServiceDetail> Services { get; set; } = new List<AppointmentServiceDetail>();
    }

    public class AppointmentServiceDetail
    {
        public int DetailId { get; set; } // ID chi tiết dịch vụ
        public int PetId { get; set; } // ID của thú cưng
        public int SvdId { get; set; } // ID của dịch vụ
        public string ServiceName { get; set; } = string.Empty; // Tên dịch vụ
        public decimal Price { get; set; } // Giá dịch vụ
    }
}
