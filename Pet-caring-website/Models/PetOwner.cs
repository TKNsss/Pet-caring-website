using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pet_caring_website.Models;

[Table("Pet_Owners")]
public partial class PetOwner
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("pet_id")]
    public int PetId { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [ForeignKey("PetId")]
    [InverseProperty("PetOwners")]
    public virtual Pet Pet { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("PetOwners")]
    public virtual User User { get; set; } = null!;

    // Thêm thuộc tính này để hỗ trợ quan hệ một-nhiều
    public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
}
