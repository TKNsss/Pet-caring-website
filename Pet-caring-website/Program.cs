using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Pet_caring_website.Data;

namespace Pet_caring_website
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

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
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
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

            // Lấy chuỗi kết nối từ appsettings.json
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string is missing in appsettings.json");
            }

            // Đăng ký DbContext với PostgreSQL
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            builder.Services.AddControllers();

            // Cấu hình CORS để React.js có thể gọi API
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactFrontend",
                    policy => policy
                        .WithOrigins("http://localhost:3000") // Chỉnh sửa nếu React chạy trên cổng khác
                        .AllowCredentials()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            var app = builder.Build();

            // Middleware xử lý lỗi cho production
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseCors("AllowReactFrontend");
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            // Định tuyến API
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.MapControllers();

            app.Run();
        }
    }
}
