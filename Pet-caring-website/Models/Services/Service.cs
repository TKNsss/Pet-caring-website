using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pet_caring_website.Models.Services;

public partial class Service
{
    [Key]
    [Column("service_id")]
    public short ServiceId { get; set; }

    [Column("service_name")]
    [StringLength(100)]
    public string ServiceName { get; set; } = null!;

    [Column("service_type")]
    [StringLength(100)]
    public string ServiceType { get; set; } = null!;

    [Column("description")]
    public string Description { get; set; } = null!;

    [Column("rating_stars")]
    [Precision(2, 1)]
    public decimal? RatingStars { get; set; }

    [Column("rating_count")]
    public int? RatingCount { get; set; }

    [Column("keywords")]
    public string[]? Keywords { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; }

    [Column("update_at", TypeName = "timestamp without time zone")]
    public DateTime UpdateAt { get; set; }

    [Column("service_img")]
    public string? ServiceImgUrl { get; set; }

    // one to many: 1 service can have many service pricings,...
    // (EF)virtual: lazy loading -> delays loading related data until you explicitly access it.
    // use lazy loading when:
    // You have many related entities but only need some of them depending on the logic
    // You want to avoid loading unnecessary data by default

    [InverseProperty("Service")]
    public virtual ICollection<ServiceDetail> ServiceDetails { get; set; } = new List<ServiceDetail>();

    [InverseProperty("Service")]
    public virtual ICollection<ServicePricing> ServicePricings { get; set; } = new List<ServicePricing>();

    [InverseProperty("Service")]
    public virtual ICollection<ServiceSlotCapacity> ServiceSlotCapacities { get; set; } = new List<ServiceSlotCapacity>();
}
