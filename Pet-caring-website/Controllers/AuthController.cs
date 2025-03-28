using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Text;
using System.Security.Cryptography;
using Pet_caring_website.Data;
using Pet_caring_website.Models;
using Pet_caring_website.Services;
using Pet_caring_website.DTOs;
using BCrypt.Net;

namespace Pet_caring_website.Controllers
{
    [ApiController]
    // defines the route for the controller
    [Route("api/v1/[controller]")]
    // ControllerBase: the base class for API controllers.It provides methods and properties for handling HTTP requests and responses.
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;
        private readonly OtpService _otpService;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, EmailService emailService, IConfiguration configuration, OtpService otpService)
        {
            _context = context;
            _emailService = emailService;
            _otpService = otpService;
            _configuration = configuration;
        }

        // 🔹 1. Đăng nhập Google
        [HttpGet("login-google")]
        public IActionResult LoginWithGoogle()
        {
            var redirectUrl = Url.Action(nameof(GoogleResponse), "Auth", null, Request.Scheme);
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        // 🔹 2. Xử lý phản hồi từ Google
        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!result.Succeeded) return BadRequest("Đăng nhập Google thất bại");

            var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId))
                return BadRequest("Không lấy được email hoặc GoogleId từ Google");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                user = new User
                {

                    UserId = Guid.NewGuid(),
                    UserName = name ?? email,
                    Email = email.ToLower(),
                    Password = null, // OAuth user, no password needed
                    Role = "client"
                };

                try
                {
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    return StatusCode(500, $"Lỗi khi lưu thông tin người dùng: {ex.Message}");
                }
            }

            // 🔹 Tạo JWT Token
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Đăng nhập Google thành công",
                token,
                user = new
                {
                    id = user.UserId,
                    username = user.UserName,
                    email = user.Email,
                }
            });
        }


        // 🔹 3. Đăng ký người dùng
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Email đã tồn tại");

            if (string.IsNullOrEmpty(request.OtpCode))  // Bước 1: Gửi OTP
            {
                var otp = _otpService.GenerateOtp(request.Email);
                _emailService.SendOtpEmail(request.Email, otp);
                return Ok(new { message = "Mã OTP đã được gửi đến email của bạn." });
            }
            else  // Bước 2: Xác thực OTP
            {
                if (!_otpService.VerifyOtp(request.Email, request.OtpCode))
                {
                    return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn!" });
                }
            }

                var newUser = new User
            {
                UserId = Guid.NewGuid(),
                UserName = request.UserName,
                Email = request.Email,
                Password = HashPassword(request.Password),
                Role = "client"
            };

            try
            {
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                return Ok("Đăng ký thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lưu thông tin người dùng: {ex.Message}");
            }
        }

        // 🔹 4. Đăng nhập bằng email & password
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser == null || !VerifyPassword(request.Password, existingUser.Password))
                return Unauthorized("Thông tin đăng nhập không chính xác");

            var token = GenerateJwtToken(existingUser);

            return Ok(new
            {
                message = "Đăng nhập thành công",
                token,
                user = new
                {
                    id = existingUser.UserId,
                    username = existingUser.UserName,
                    email = existingUser.Email,                   
                }
            });
        }

        // 🔹 5. API lấy thông tin user
        [HttpGet("user-info")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null)
                return Unauthorized("Bạn chưa đăng nhập");

            var user = await _context.Users.FindAsync(Guid.Parse(userId));
            return Ok(user);
        }

        //// 🔹 6. Cấp quyền admin
        //[HttpPost("grant-admin/{userId}")]
        //[Authorize(Roles = "Admin")]
        //public async Task<IActionResult> GrantAdmin(Guid userId)
        //{
        //    var user = await _context.Users.FindAsync(userId);
        //    if (user == null) return NotFound("Không tìm thấy người dùng");

        //    user.is_admin = true;
        //    await _context.SaveChangesAsync();
        //    return Ok($"Người dùng {user.user_name} đã được cấp quyền admin");
        //}

        //// 🔹 7. Thu hồi quyền admin
        //[HttpPost("revoke-admin/{userId}")]
        //[Authorize(Roles = "Admin")]
        //public async Task<IActionResult> RevokeAdmin(Guid userId)
        //{
        //    var user = await _context.Users.FindAsync(userId);
        //    if (user == null) return NotFound("Không tìm thấy người dùng");
        //    user.is_admin = false;
        //    await _context.SaveChangesAsync();
        //    return Ok($"Quyền admin của {user.user_name} đã bị thu hồi");
        //}

        // API đăng xuất
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok("Đăng xuất thành công");
        }

        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

        // 🔹 8. Tạo JWT Token
        private string GenerateJwtToken(User user)
        {
            // Retrieves the secret key(Jwt:Key) from appsettings.json.
            // Converts it into bytes and creates a SymmetricSecurityKey.
            // SymmetricSecurityKey means the same key is used for both signing and verifying the token.
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            // Uses the secret key to create SigningCredentials using HMAC SHA-256
            // Ensures the integrity of the token.
            // The recipient can verify that the token was generated by the server and not tampered with.
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // A claim is a key - value pair that holds user information.
            // Defines the payload(data) stored inside the JWT token.
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), 
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // Retrieves the expiration time from appsettings.json (Jwt:ExpiryInHours).
            // JWT tokens should expire after a certain time to improve security. 
            // Set token expiration (default to 3 hours if missing)
            if (!int.TryParse(_configuration["Jwt:ExpiryInHours"], out int expiryHours))
                expiryHours = 3;

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"], // server issued the token
                audience: _configuration["Jwt:Audience"], // client that is allowed to use the token
                claims: claims, // User's claims (user's data)
                expires: DateTime.UtcNow.AddHours(expiryHours),
                signingCredentials: credentials // Signing key (HMAC SHA-256) - The security key used to sign the token
            );
            // returns the converted JwtSecurityToken object as a string.
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
    