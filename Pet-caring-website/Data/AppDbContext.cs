using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Models;

namespace Pet_caring_website.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Users> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>()
                .Property(u => u.user_id)
                .HasDefaultValueSql("gen_random_uuid()");
        }

    }
}
