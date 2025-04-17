using System.ComponentModel.DataAnnotations;
namespace Pet_caring_website.DTOs.User.Appointment;

public class CreateAppointmentRequest
{
    [Required]
    public DateTime ApDate { get; set; } // Ngày hẹn

    public string? Notes { get; set; } // Ghi chú

    [Required]
    public List<AppointmentServiceRequest> Services { get; set; } = new();
}
