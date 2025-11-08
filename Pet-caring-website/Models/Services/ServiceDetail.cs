using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Models.Appointments;

namespace Pet_caring_website.Models.Services;

[Table("Service_Detail")]
public partial class ServiceDetail
{
    [Key]
    [Column("svd_id")]
    public int SvdId { get; set; }

    [Column("service_id")]
    public short ServiceId { get; set; }

    [Column("amount")]
    public short? Amount { get; set; }

    [Column("duration")]
    public short? Duration { get; set; }

    [Column("price_per_service")]
    [Precision(10, 2)]
    public decimal PricePerService { get; set; }

    [InverseProperty("Svd")]
    public virtual ICollection<AppointmentDetail> AppointmentDetails { get; set; } = new List<AppointmentDetail>();

    [ForeignKey("ServiceId")]
    [InverseProperty("ServiceDetails")]
    public virtual Service Service { get; set; } = null!;
}
