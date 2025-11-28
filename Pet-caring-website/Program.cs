using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Pet_caring_website.Services;
using Pet_caring_website.Configurations;
using CloudinaryDotNet;
using OpenTelemetry.Logs;
using Pet_caring_website.Interfaces;
using Pet_caring_website.Middleware;

namespace Pet_caring_website
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ------------------------------------------------
            // 1. Load configuration
            // ------------------------------------------------
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string is missing in appsettings.json");

            var cloudinaryConfig = builder.Configuration.GetSection("Cloudinary").Get<CloudinarySettings>()
                ?? throw new InvalidOperationException("Cloudinary settings are missing!");

            if (string.IsNullOrEmpty(cloudinaryConfig.CloudName) ||
                string.IsNullOrEmpty(cloudinaryConfig.ApiKey) ||
                string.IsNullOrEmpty(cloudinaryConfig.ApiSecret))
                throw new InvalidOperationException("Cloudinary credentials are missing in configuration.");

            var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()
                ?? throw new InvalidOperationException("JWT settings are missing.");

            if (string.IsNullOrEmpty(jwtSettings.SecretKey))
                throw new InvalidOperationException("JWT key is missing from configuration.");

            var jwtKey = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

            var googleOptions = builder.Configuration.GetSection("Authentication:Google").Get<GoogleAuthSettings>()
                ?? throw new InvalidOperationException("Google authentication settings are missing.");

            if (string.IsNullOrEmpty(googleOptions.ClientId) || string.IsNullOrEmpty(googleOptions.ClientSecret))
                throw new InvalidOperationException("Google credentials are missing in configuration.");

            var emailConfig = builder.Configuration.GetSection("Email").Get<EmailSettings>()
                ?? throw new InvalidOperationException("Email settings are missing.");

            if (string.IsNullOrWhiteSpace(emailConfig.SmtpServer) ||
                emailConfig.SmtpPort <= 0 ||
                string.IsNullOrWhiteSpace(emailConfig.SmtpUser) ||
                string.IsNullOrWhiteSpace(emailConfig.SmtpPassword))
            {
                throw new InvalidOperationException("Email SMTP settings are incomplete.");
            }

            var superAdminEmails = builder.Configuration.GetSection("SuperAdmins").Get<List<string>>() ?? new List<string>();

            // ------------------------------------------------
            // 2. Register services
            // ------------------------------------------------
            // DbContext
            builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

            // Controllers
            builder.Services.AddControllers();

            // AutoMapper
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // Logging
            builder.Logging.ClearProviders();
            builder.Logging.AddOpenTelemetry(options =>
            {
                options.IncludeFormattedMessage = true;
                options.IncludeScopes = true;
                options.ParseStateValues = true;
                options.AddConsoleExporter();
            });

            // Email
            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
            builder.Services.AddScoped<IEmailService, EmailService>();

            // Auth & JWT
            builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
            builder.Services.Configure<GoogleAuthSettings>(builder.Configuration.GetSection("Authentication:Google"));
            builder.Services.Configure<GithubAuthSettings>(builder.Configuration.GetSection("Authentication:GitHub"));
            builder.Services.AddScoped<IJwtService, JwtService>();
            builder.Services.AddScoped<IAuthService, AuthService>();

            // OTP
            builder.Services.AddMemoryCache();
            builder.Services.AddScoped<IOtpService, OtpService>();

            // User context
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<IUserContextService, UserContextService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IServiceService, ServiceService>();

            // Pet service
            builder.Services.AddScoped<IPetService, PetService>();

            // Cloudinary
            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
            var account = new Account(cloudinaryConfig.CloudName, cloudinaryConfig.ApiKey, cloudinaryConfig.ApiSecret);
            builder.Services.AddSingleton(new Cloudinary(account) { Api = { Secure = true } });
            builder.Services.AddScoped<IImageService, ImageService>();
            builder.Services.AddScoped<ImageService>();

            // CORS
            var corsPolicy = "AllowFrontend";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(corsPolicy, policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            })
            .AddCookie(options =>
            {
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            builder.Services.AddAuthorization();

            // Exception handling
            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
            builder.Services.AddProblemDetails(options =>
            {
                options.CustomizeProblemDetails = context =>
                {
                    context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier);
                };
            });

            // ------------------------------------------------
            // 3. Build app & configure middleware
            // ------------------------------------------------
            var app = builder.Build();

            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseCors(corsPolicy);
            app.UseStaticFiles();
            app.UseRouting();
            app.UseExceptionHandler();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            app.MapControllers();

            app.Run();
        }
    }
}
