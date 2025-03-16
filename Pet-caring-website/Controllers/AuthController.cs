using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;
using Pet_caring_website.Data;
using Pet_caring_website.Models;
using Pet_caring_website.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace Pet_caring_website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // Đăng nhập bằng Google
        [HttpGet("login-google")]
        public IActionResult LoginWithGoogle()
        {
            var redirectUrl = Url.Action(nameof(GoogleResponse), "Auth");
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        // Xử lý callback từ Google
        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!result.Succeeded)
                return BadRequest("Đăng nhập Google thất bại");

            var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
                return BadRequest("Không lấy được email từ Google");

            // Kiểm tra xem người dùng đã tồn tại chưa
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);
            if (user == null)
            {
                user = new Users
                {
                    user_id = Guid.NewGuid(),
                    user_name = name ?? "Người dùng Google",
                    email = email,
                    password = "",  // Không lưu mật khẩu vì đăng nhập bằng Google
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

            return Ok(new { message = "Đăng nhập Google thành công", user });
        }

        // Xử lý yêu cầu đăng ký
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
                phone = "0000000000",
                address = "Chưa cập nhật",
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

        // Xử lý yêu cầu đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);
            if (existingUser == null || existingUser.password != HashPassword(request.password))
                return Unauthorized("Thông tin đăng nhập không chính xác");

            // Tạo danh sách claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, existingUser.user_id.ToString()),
                new Claim(ClaimTypes.Name, existingUser.user_name),
                new Claim(ClaimTypes.Email, existingUser.email),
                new Claim(ClaimTypes.Role, existingUser.is_admin ? "Admin" : "User")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true, // Giữ đăng nhập khi đóng trình duyệt
                ExpiresUtc = DateTime.UtcNow.AddHours(2) // Thời gian hết hạn
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                                          new ClaimsPrincipal(claimsIdentity),
                                          authProperties);

            return Ok("Đăng nhập thành công");
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        [HttpGet("user-info")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized("Bạn chưa đăng nhập");

            var user = await _context.Users.FindAsync(Guid.Parse(userId));
            return Ok(user);
        }

        // API đăng xuất
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity()); // Xóa user khỏi context
            return Ok("Đăng xuất thành công");
        }

        // Cấp quyền admin
        [HttpPost("grant-admin/{userId}")]
        public async Task<IActionResult> GrantAdmin(Guid userId)
        {
            var requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var requestingUser = await _context.Users.FindAsync(Guid.Parse(requestingUserId));

            if (requestingUser == null || !requestingUser.is_admin)
                return Unauthorized("Bạn không có quyền cấp admin");

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Không tìm thấy người dùng");

            user.is_admin = true;
            await _context.SaveChangesAsync();

            return Ok($"Người dùng {user.user_name} đã được cấp quyền admin");
        }
    }
}
