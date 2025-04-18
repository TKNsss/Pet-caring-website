using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pet_caring_website.Models;

public partial class Appointment
{
    [Key]
    [Column("ap_id")]
    public int ApId { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("ap_date", TypeName = "timestamp without time zone")]
    public DateTime ApDate { get; set; }

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = null!;

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("create_at", TypeName = "timestamp without time zone")]
    public DateTime CreateAt { get; set; }

    [Column("vet_id")]
    public Guid? VetId { get; set; }

    [InverseProperty("Ap")]
    public virtual ICollection<AppointmentDetail> AppointmentDetails { get; set; } = new List<AppointmentDetail>();

    [ForeignKey("UserId")]
    [InverseProperty("CustomerAppointments")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("VetId")]
    [InverseProperty("VetAppointments")]
    public virtual User? Vet { get; set; }
}
