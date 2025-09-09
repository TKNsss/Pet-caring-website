using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pet_caring_website.Models;

public partial class Species
{
    [Key]
    [Column("spc_id")]
    public short SpcId { get; set; }

    [Column("spc_name")]
    [StringLength(50)]
    public string SpcName { get; set; } = null!;

    [InverseProperty("Species")]
    public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
}
