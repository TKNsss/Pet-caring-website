using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.Cookies;
using Pet_caring_website.Data;
using Pet_caring_website.Services;
using Microsoft.OpenApi.Models;
using System.Text;

namespace Pet_caring_website
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ✅ 1. Thêm Email Service
            builder.Services.AddScoped<EmailService>();

            // ✅ 2. Cấu hình session
            builder.Services.AddMemoryCache();
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            // ✅ 3. Lấy thông tin cấu hình Google OAuth
            var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
            var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
            if (string.IsNullOrEmpty(googleClientId) || string.IsNullOrEmpty(googleClientSecret))
            {
                throw new InvalidOperationException("Google Client ID hoặc Secret bị thiếu.");
            }

            // ✅ 4. Cấu hình JWT Authentication
            var jwtSecretKey = builder.Configuration["Jwt:SecretKey"];
            if (string.IsNullOrEmpty(jwtSecretKey))
            {
                throw new InvalidOperationException("JWT Secret Key bị thiếu.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey));

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = key
                };
            })
            .AddGoogle(googleOptions =>
            {
                googleOptions.ClientId = googleClientId;
                googleOptions.ClientSecret = googleClientSecret;
                googleOptions.CallbackPath = new PathString("/api/v1/auth/google-response");;
            });

            // ✅ 5. Cấu hình CORS cho React Frontend
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:3000") // 🎯 Đặt đúng URL frontend của bạn!
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // ✅ 6. Kết nối Database
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string bị thiếu trong appsettings.json");
            }

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // ✅ 7. Middleware xử lý lỗi & bảo mật
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            // ✅ 8. Kích hoạt CORS & Session
            app.UseCors("AllowReactFrontend");
            app.UseSession();

            // ✅ 9. Thêm Authentication & Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.Run();
        }
    }
}
