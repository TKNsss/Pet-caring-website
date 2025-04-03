using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pet_caring_website.Models;

public partial class Service
{
    [Key]
    [Column("service_id")]
    public short ServiceId { get; set; }

    [Column("service_name")]
    [StringLength(225)]
    public string ServiceName { get; set; } = null!;

    [Column("description")]
    public string Description { get; set; } = null!;

    [Column("create_at", TypeName = "timestamp without time zone")]
    public DateTime CreateAt { get; set; }

    [InverseProperty("Service")]
    public virtual ICollection<ServiceDetail> ServiceDetails { get; set; } = new List<ServiceDetail>();

    [InverseProperty("Service")]
    public virtual ICollection<ServicePricing> ServicePricings { get; set; } = new List<ServicePricing>();
}
