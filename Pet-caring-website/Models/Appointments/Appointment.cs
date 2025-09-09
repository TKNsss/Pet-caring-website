using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pet_caring_website.Models.Appointments;

public partial class Appointment
{
    [Key]
    [Column("ap_id")]
    public int ApId { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("ap_date", TypeName = "date")]
    public DateOnly ApDate { get; set; }

    [Column("start_time", TypeName = "time without time zone")]
    public TimeOnly StartTime { get; set; }

    [Column("end_time", TypeName = "time without time zone")]
    public TimeOnly EndTime { get; set; }

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = null!;

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("vet_id")]
    public Guid? VetId { get; set; }

    [Column("update_at", TypeName = "timestamp without time zone")]
    public DateTime UpdateAt { get; set; }

    [InverseProperty("Ap")]
    public virtual ICollection<AppointmentDetail> AppointmentDetails { get; set; } = new List<AppointmentDetail>();

    [ForeignKey("UserId")]
    [InverseProperty("Appointments")]
    public virtual User User { get; set; } = null!;
}
