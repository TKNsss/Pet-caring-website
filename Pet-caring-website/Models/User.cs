using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pet_caring_website.Models;

public partial class User
{
    [Key]
    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("user_name")]
    [StringLength(50)]
    public string? UserName { get; set; } // This field is nullable, meaning the user can have no username.

    [Column("email")]
    [StringLength(30)]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = null!; // Non-nullable field, meaning it must always contain a value.

    [Column("first_name")]
    [StringLength(50)]
    public string? FirstName { get; set; }

    [Column("last_name")]
    [StringLength(50)]
    public string? LastName { get; set; }

    [Column("password")]
    [StringLength(80, MinimumLength = 8, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; } = null!;

    [Column("phone")]
    [StringLength(10)]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must have 10 digits.")]
    public string? Phone { get; set; }

    [Column("address")]
    [StringLength(255)]
    public string? Address { get; set; }

    [Column("speciality")]
    [StringLength(50)]
    public string? Speciality { get; set; }

    [Column("role")]
    public string Role { get; set; } = null!;

    [InverseProperty("User")]
    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    // Maps this collection to the User property inside the PetOwner entity.
    [InverseProperty("User")]
    public virtual ICollection<PetOwner> PetOwners { get; set; } = new List<PetOwner>();
}
