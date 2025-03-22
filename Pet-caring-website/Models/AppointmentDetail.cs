using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pet_caring_website.Models;

[Table("Appointment_Details")]
public partial class AppointmentDetail
{
    [Key]
    [Column("detail_id")]
    public int DetailId { get; set; }

    [Column("ap_id")]
    public int ApId { get; set; }

    [Column("pet_id")]
    public int PetId { get; set; }

    [Column("svd_id")]
    public int SvdId { get; set; }

    [ForeignKey("ApId")]
    [InverseProperty("AppointmentDetails")]
    public virtual Appointment Ap { get; set; } = null!;

    [ForeignKey("SvdId")]
    [InverseProperty("AppointmentDetails")]
    public virtual ServiceDetail Svd { get; set; } = null!;
}
