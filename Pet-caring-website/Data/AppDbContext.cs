using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Models;

// This class in our application code to interact with the underlying database. It is this class that manages
// the database connection and is used to retrieve and save data in the database

namespace Pet_caring_website.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Each DbSet<T> property represents a table in the database.
        public virtual DbSet<Appointment> Appointments { get; set; }

        public virtual DbSet<AppointmentDetail> AppointmentDetails { get; set; }

        public virtual DbSet<Pet> Pets { get; set; }

        public virtual DbSet<PetOwner> PetOwners { get; set; }

        public virtual DbSet<Service> Services { get; set; }

        public virtual DbSet<ServiceDetail> ServiceDetails { get; set; }

        public virtual DbSet<ServicePricing> ServicePricings { get; set; }

        public virtual DbSet<Species> Species { get; set; }

        public virtual DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.ApId).HasName("Appointments_pkey");

                entity.Property(e => e.ApId).UseIdentityAlwaysColumn();

                // Giữ kiểu dữ liệu 'timestamp without time zone' cho ApDate
                entity.Property(e => e.ApDate)
                    .HasColumnType("timestamp without time zone");

                // Giữ kiểu dữ liệu 'timestamp without time zone' cho CreateAt
                entity.Property(e => e.CreateAt)
                    .HasColumnType("timestamp without time zone");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnType("character varying(20)");

                entity.HasOne(d => d.User).WithMany(p => p.Appointments)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_appointments_users");
            });

            modelBuilder.Entity<AppointmentDetail>(entity =>
            {
                entity.HasKey(e => e.DetailId).HasName("Appointment_Details_pkey");

                entity.Property(e => e.DetailId).UseIdentityAlwaysColumn();

                entity.HasOne(d => d.Ap).WithMany(p => p.AppointmentDetails)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_appointment_Details_appointments");

                entity.HasOne(d => d.Svd).WithMany(p => p.AppointmentDetails)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_appoinment_Details_service_details");
            });

            modelBuilder.Entity<Pet>(entity =>
            {
                entity.HasKey(e => e.PetId).HasName("Pets_pkey");

                entity.Property(e => e.PetId).UseIdentityAlwaysColumn();

                entity.Property(e => e.Gender)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnType("character varying(20)");

                entity.HasOne(d => d.Species).WithMany(p => p.Pets).HasConstraintName("fk_pets_species");
            });

            modelBuilder.Entity<PetOwner>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("Pet_Owners_pkey");

                entity.Property(e => e.Id).UseIdentityAlwaysColumn();

                entity.HasOne(d => d.Pet).WithMany(p => p.PetOwners)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_owners_pets");

                entity.HasOne(d => d.User).WithMany(p => p.PetOwners)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_owners_users");
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(e => e.ServiceId).HasName("Services_pkey");

                entity.Property(e => e.ServiceId).UseIdentityAlwaysColumn();
            });

            modelBuilder.Entity<ServiceDetail>(entity =>
            {
                entity.HasKey(e => e.SvdId).HasName("Service_Detail_pkey");

                entity.Property(e => e.SvdId).UseIdentityAlwaysColumn();

                entity.HasOne(d => d.Service).WithMany(p => p.ServiceDetails)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_service_detail_services");
            });

            modelBuilder.Entity<ServicePricing>(entity =>
            {
                entity.HasKey(e => e.PricingId).HasName("Service_Pricing_pkey");

                entity.Property(e => e.PricingId).UseIdentityAlwaysColumn();

                entity.HasOne(d => d.Service).WithMany(p => p.ServicePricings)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_service_pricing_services");
            });

            modelBuilder.Entity<Species>(entity =>
            {
                entity.HasKey(e => e.SpcId).HasName("Species_pkey");

                entity.Property(e => e.SpcId).UseIdentityAlwaysColumn();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId).HasName("Users_pkey");

                entity.Property(e => e.UserId).ValueGeneratedNever();
                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnType("character varying(50)");
                entity.Property(e => e.Phone).IsFixedLength();
                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnType("character varying(20)");
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
