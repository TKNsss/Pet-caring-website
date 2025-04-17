using System.ComponentModel.DataAnnotations;

namespace Pet_caring_website.DTOs.User.Appointment;

public class AppointmentServiceRequest
{
    [Required]
    public int PetId { get; set; } // ID của thú cưng

    [Required]
    public int ServiceId { get; set; } // ID của dịch vụ
}
