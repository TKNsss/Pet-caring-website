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
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, EmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
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

            if (!result.Succeeded)
                return BadRequest("Đăng nhập Google thất bại");

            var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId))
                return BadRequest("Không lấy được email hoặc GoogleId từ Google");

            // Kiểm tra xem người dùng đã tồn tại chưa
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {     
                // Nếu chưa tồn tại, tạo mới người dùng
                user = new User
                {

                    UserId = Guid.NewGuid(),
                    UserName = name ?? email,
                    Email = email.ToLower(),
                    Password = null, // No password since it's an OAuth user
                    Role = "client"
                };

                try
                {
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    return StatusCode(500, "Lỗi khi lưu thông tin người dùng");
                }
            }

            // 🔹 Tạo JWT Token
            var token = GenerateJwtToken(user);
            return Ok(new { message = "Đăng nhập Google thành công", token });
        }


        // 🔹 3. Đăng ký người dùng
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Email đã tồn tại");

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
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser == null || !VerifyPassword(request.Password, existingUser.Password))
                return Unauthorized("Thông tin đăng nhập không chính xác");

            var token = GenerateJwtToken(existingUser);
            return Ok(new { message = "Đăng nhập thành công", token });
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
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var expiryHours = int.Parse(_configuration["Jwt:ExpiryInHours"] ?? "3");
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiryHours),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
    