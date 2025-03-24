using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;
using Pet_caring_website.Data;
using Pet_caring_website.Models;
using Pet_caring_website.Services;
using Pet_caring_website.DTOs;

namespace Pet_caring_website.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
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
            if (!result.Succeeded) return BadRequest("Đăng nhập Google thất bại");

            var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email)) return BadRequest("Không lấy được email từ Google");

            // 🔹 Kiểm tra xem user đã tồn tại chưa
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);
            if (user == null)
            {
                user = new Users
                {
                    user_id = Guid.NewGuid(),
                    user_name = name ?? "Người dùng Google",
                    email = email,
                    password = HashPassword(GenerateRandomPassword()),  // ✅ Tạo mật khẩu ngẫu nhiên và mã hóa
                    phone = "0000000000",
                    address = "Chưa cập nhật",
                    is_admin = false
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
            if (await _context.Users.AnyAsync(u => u.email == request.email))
                return BadRequest("Email đã tồn tại");

            var newUser = new Users
            {
                user_id = Guid.NewGuid(),
                user_name = request.user_name,
                email = request.email,
                password = HashPassword(request.password),
                phone = request.phone ?? "0000000000",
                address = request.address ?? "Chưa cập nhật",
                is_admin = false
            };

            try
            {
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                return Ok("Đăng ký thành công");
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "Lỗi khi lưu thông tin người dùng");
            }
        }

        // 🔹 4. Đăng nhập bằng email & password
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);
            if (existingUser == null || existingUser.password != HashPassword(request.password))
                return Unauthorized("Thông tin đăng nhập không chính xác");

            var token = GenerateJwtToken(existingUser);
            return Ok(new { message = "Đăng nhập thành công", token });
        }

        // 🔹 5. API lấy thông tin user
        [HttpGet("user-info")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("Bạn chưa đăng nhập");

            var user = await _context.Users.FindAsync(Guid.Parse(userId));
            return Ok(user);
        }

        // 🔹 6. Cấp quyền admin
        [HttpPost("grant-admin/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GrantAdmin(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Không tìm thấy người dùng");

            user.is_admin = true;
            await _context.SaveChangesAsync();
            return Ok($"Người dùng {user.user_name} đã được cấp quyền admin");
        }

        // 🔹 7. Thu hồi quyền admin
        [HttpPost("revoke-admin/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RevokeAdmin(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Không tìm thấy người dùng");

            if (!user.is_admin)
                return BadRequest("Người dùng này không phải admin");

            user.is_admin = false;
            await _context.SaveChangesAsync();
            return Ok($"Quyền admin của {user.user_name} đã bị thu hồi");
        }

        // 🔹 8. Tạo JWT Token
        private string GenerateJwtToken(Users user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.user_id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.email),
                new Claim(ClaimTypes.Name, user.user_name),
                new Claim(ClaimTypes.Role, user.is_admin ? "Admin" : "User")
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // 🔹 9. Hàm hash mật khẩu SHA256
        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(bytes).Replace("-", "").ToLower();
            }
        }

        //   10. Tạo mật khẩu ngẫu nhiên
        private string GenerateRandomPassword()
        {
            const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
            Random random = new Random();
            return new string(Enumerable.Repeat(validChars, 12) // ✅ Tạo mật khẩu 12 ký tự
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
    