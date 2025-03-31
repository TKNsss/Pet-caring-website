using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Pet_caring_website
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // get connection string from appsettings.Development.json
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string is missing in appsettings.json");
            }

            // ADD SERVICES:
            // Registers controllers in the application to handle API requests.
            builder.Services.AddControllers();
            // Đăng ký DbContext với PostgreSQL
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            // CONFIGURE CORS
            var corsPolicy = "_UIAllowSpecificOrigins"; // Define a CORS policy name

            // allows requests from http://localhost:5173.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: corsPolicy, policy =>
                {
                    policy.WithOrigins("http://localhost:5173") // Allow only your frontend
                          .AllowAnyHeader()  // Allow any headers (e.g., Authorization, Content-Type)
                          .AllowAnyMethod();  // Allow GET, POST, PUT, DELETE, etc.
                });
            });

            // Configure Authentication & JWT 
            var jwtSettings = builder.Configuration.GetSection("Jwt"); // Gets the JWT settings from appsettings.json.
            // Converts the key into a byte array(required for cryptographic operations).
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            // configures the authentication system in ASP.NET Core
            // => This tells ASP.NET Core to automatically validate JWT tokens when users access secured endpoints.
            builder.Services.AddAuthentication(options =>
            {
                // Sets JWT Bearer authentication as the default scheme for authenticating users.
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                // Defines JWT Bearer authentication as the default scheme when challenging unauthorized users.
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false; // Allows tokens over HTTP (useful for local development).
                options.SaveToken = true; // Saves the token inside the authentication properties after validation.
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true, // Ensures the token is signed using a valid secret key.
                    IssuerSigningKey = new SymmetricSecurityKey(key), // Uses the secret key (Key) from appsettings.json for signature validation.
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true // Ensures the token has not expired.
                };
            });

            // GOOGLE AUTHENTICATION
            // Lấy danh sách Super-Admin từ appsettings.json
            var superAdminEmails = builder.Configuration.GetSection("SuperAdmins").Get<List<string>>() ?? new List<string>();
            // Lấy ClientId và ClientSecret từ cấu hình hoặc biến môi trường
            var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
            var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

            if (string.IsNullOrEmpty(googleClientId) || string.IsNullOrEmpty(googleClientSecret))
            {
                throw new InvalidOperationException("Google Client ID or Secret is missing. Ensure it's set in appsettings.json or environment variables.");
            }

            // Cấu hình xác thực Google + Cookie
            builder.Services.AddAuthentication()
            .AddCookie(options =>
            {
                options.LoginPath = "/api/auth/login"; // Đường dẫn đăng nhập
                options.LogoutPath = "/api/auth/logout"; // Đăng xuất
                options.AccessDeniedPath = "/api/auth/access-denied"; // Khi bị từ chối
                options.ExpireTimeSpan = TimeSpan.FromHours(2);
                options.SlidingExpiration = true;
                options.Cookie.HttpOnly = true; // Bảo mật cookie
                options.Cookie.SameSite = SameSiteMode.None; // Để hoạt động với frontend React.js
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Chỉ gửi cookie qua HTTPS
            })
            .AddGoogle(googleOptions =>
            {
                googleOptions.ClientId = googleClientId;
                googleOptions.ClientSecret = googleClientSecret;
                googleOptions.CallbackPath = "/signin-google";
            });

            builder.Services.AddAuthorization();

            var app = builder.Build();

            // Middleware xử lý lỗi cho production
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseCors(corsPolicy);
            app.UseStaticFiles();
            // Enables endpoint routing.
            app.UseRouting();
            // Ensures authentication and authorization are applied.
            app.UseAuthentication();
            app.UseAuthorization();

            // Định tuyến API
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            // Maps API controllers to handle HTTP requests.
            app.MapControllers();
            app.Run();
        }
    }
}
