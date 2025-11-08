using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pet_caring_website.Models.Services;

[Table("Service_Slot_Capacity")]
public partial class ServiceSlotCapacity
{
    [Key]
    [Column("ssc_id")]
    public short SscId { get; set; }

    [Column("service_id")]
    public short ServiceId { get; set; }

    [Column("max_bookings")]
    public int? MaxBookings { get; set; }

    [Column("update_at", TypeName = "timestamp without time zone")]
    public DateTime UpdateAt { get; set; }

    [ForeignKey("ServiceId")]
    [InverseProperty("ServiceSlotCapacities")]
    public virtual Service Service { get; set; } = null!;
}
