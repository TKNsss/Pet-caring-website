using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pet_caring_website.Models;

[Table("Service_Pricing")]
public partial class ServicePricing
{
    [Key]
    [Column("pricing_id")]
    public short PricingId { get; set; }

    [Column("service_id")]
    public short ServiceId { get; set; }

    [Column("min_weight")]
    [Precision(3, 2)]
    public decimal MinWeight { get; set; }

    [Column("max_weight")]
    [Precision(3, 2)]
    public decimal MaxWeight { get; set; }

    [Column("price")]
    [Precision(10, 2)]
    public decimal Price { get; set; }

    [Column("create_at", TypeName = "timestamp without time zone")]
    public DateTime CreateAt { get; set; }

    [Column("update_at")]
    public List<DateTime> UpdateAt { get; set; } = null!;

    [ForeignKey("ServiceId")]
    [InverseProperty("ServicePricings")]
    public virtual Service Service { get; set; } = null!;
}
