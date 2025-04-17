using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pet_caring_website.Models;

public partial class Pet
{
    [Key]
    [Column("pet_id")]
    public int PetId { get; set; }

    [Column("spc_id")]
    public short? SpcId { get; set; }

    [Column("pet_name")]
    [StringLength(50)]
    public string PetName { get; set; } = null!;

    [Column("breed")]
    [StringLength(50)]
    public string? Breed { get; set; }

    [Column("age")]
    public short Age { get; set; }

    [Column("gender")]
    [StringLength(20)]
    public string Gender { get; set; } = null!;

    [Column("weight")]
    [Precision(10, 1)]
    public decimal Weight { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [InverseProperty("Pet")]
    public virtual ICollection<PetOwner> PetOwners { get; set; } = new List<PetOwner>();

    [ForeignKey("SpcId")]
    [InverseProperty("Pets")]
    public virtual Species? Spc { get; set; }
}
