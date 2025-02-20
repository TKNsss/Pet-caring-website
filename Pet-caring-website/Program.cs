using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;

namespace Pet_caring_website
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // get connection string from appsettings.Development.json
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            // Register the database context (DbContext) with the connection string 
            builder.Services.AddEntityFrameworkNpgsql().AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            var app = builder.Build();

            // Test database connection
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                // ILogger<Program>: This is used to log messages to the console or a logging provider.
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

                try
                {
                    // check the status of the database connection
                    var canConnect = dbContext.Database.CanConnect();

                    if (canConnect)
                    {
                        logger.LogInformation("Successfully connected to the database!");
                    }
                    else
                    {
                        logger.LogError("Failed to connect to the database.");
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while connecting to the database.");
                }
            }

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
