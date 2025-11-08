using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pet_caring_website.Models.Services;

[Table("Service_Pricing")]
public partial class ServicePricing
{
    [Key]
    [Column("pricing_id")]
    public int PricingId { get; set; }

    [Column("service_id")]
    public short ServiceId { get; set; }

    [Column("min_weight")]
    [Precision(4, 2)]
    public decimal MinWeight { get; set; }

    [Column("max_weight")]
    [Precision(4, 2)]
    public decimal MaxWeight { get; set; }

    [Column("price")]
    [Precision(10, 2)]
    public decimal Price { get; set; }

    [Column("duration")]
    public TimeSpan? Duration { get; set; }

    [Column("update_at", TypeName = "timestamp without time zone")]
    public DateTime UpdateAt { get; set; }

    [ForeignKey("ServiceId")]
    [InverseProperty("ServicePricings")]
    public virtual Service Service { get; set; } = null!;
}
