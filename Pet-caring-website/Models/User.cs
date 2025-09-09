using Pet_caring_website.Models.Appointments;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pet_caring_website.Models;

public partial class User
{
    [Key]
    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("user_name")]
    public string? UserName { get; set; } // This field is nullable, meaning the user can have no username.

    [Column("email")]
    public string Email { get; set; } = null!; // Non-nullable field, meaning it must always contain a value.

    [Column("first_name")]
    public string? FirstName { get; set; }

    [Column("last_name")]
    public string? LastName { get; set; }

    [Column("password")]
    public string? Password { get; set; }

    [Column("phone")]
    public string? Phone { get; set; }

    [Column("address")]
    public string? Address { get; set; }

    [Column("speciality")]
    public string? Speciality { get; set; }

    [Column("role")]
    public string Role { get; set; } = null!;

    [Column("avatar_url")]
    public string? AvatarUrl { get; set; } 

    [InverseProperty("User")]
    public virtual ICollection<Appointment> CustomerAppointments { get; set; } = new List<Appointment>();

    [InverseProperty("Vet")]
    public virtual ICollection<Appointment> VetAppointments { get; set; } = new List<Appointment>();

    // Maps this collection to the User property inside the PetOwner entity.
    [InverseProperty("User")]
    public virtual ICollection<PetOwner> PetOwners { get; set; } = new List<PetOwner>();

    public User()
    {
        if (string.IsNullOrEmpty(Role))
        {
            Role = "client"; 
        }
    }
}
