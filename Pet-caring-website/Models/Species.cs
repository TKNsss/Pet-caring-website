using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pet_caring_website.Models;

public partial class Species
{
    [Key]
    [Column("spc_id")]
    public short SpcId { get; set; }

    [Column("spc_name")]
    [StringLength(50)]
    public string? SpcName { get; set; }

    [InverseProperty("Spc")]
    public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
}
