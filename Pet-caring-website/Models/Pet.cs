using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pet_caring_website.Models;

public partial class Pet
{
    [Key]
    [Column("pet_id")]
    public int PetId { get; set; }

    [Column("spc_id")]
    public short? SpcId { get; set; }

    [Column("pet_name")]
    public string PetName { get; set; } = null!;

    [Column("breed")]
    public string? Breed { get; set; }

    [Column("age")]
    public short AgeInMonths { get; set; }

    [Column("gender")]
    public string Gender { get; set; } = null!;

    [Column("weight")]
    public decimal Weight { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("status")]
    public string? Status { get; set; }

    [Column("adopt_date")]
    public DateOnly? AdoptDate { get; set; }

    [Column("avatar_url")]
    public string? AvatarUrl { get; set; }

    [InverseProperty("Pet")]
    public virtual ICollection<PetOwner> PetOwners { get; set; } = new List<PetOwner>();

    [ForeignKey("SpcId")]
    [InverseProperty("Pets")]
    public virtual Species? Species { get; set; }
}
