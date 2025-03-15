using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;
using Pet_caring_website.Data;
using Pet_caring_website.Models;
using Pet_caring_website.DTOs;
using System.Linq;
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

            if (email == null)
                return BadRequest("Không lấy được email từ Google");

            // Kiểm tra xem người dùng đã tồn tại trong database chưa
            var user = _context.Users.FirstOrDefault(u => u.email == email);
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
                _context.Users.Add(user);
                _context.SaveChanges();
            }

            return Ok(new { message = "Đăng nhập Google thành công", user });
        }

        // Xử lý yêu cầu đăng ký
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (_context.Users.Any(u => u.email == request.email))
                return BadRequest("Email đã tồn tại");

            var newUser = new Users
            {
                user_id = Guid.NewGuid(), // Tạo UUID tự động
                user_name = request.user_name,
                email = request.email,
                password = HashPassword(request.password),
                phone = "0000000000",
                address = "Chưa cập nhật",
                is_admin = false // Mặc định không phải admin
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();
            return Ok("Đăng ký thành công");
        }

        // Xử lý yêu cầu đăng nhập
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.email == request.email);
            if (existingUser == null || existingUser.password != HashPassword(request.password))
                return Unauthorized("Thông tin đăng nhập không chính xác");

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

        // Api cho quản trị viên cấp cao để cấp quyền admin cho tài khoản khác
        [HttpPost("grant-admin/{userId}")]
        public IActionResult GrantAdmin(Guid userId)
        {
            var requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Lấy user đang đăng nhập
            var requestingUser = _context.Users.Find(Guid.Parse(requestingUserId));

            if (requestingUser == null || !requestingUser.is_admin)
                return Unauthorized("Bạn không có quyền cấp admin");

            var user = _context.Users.Find(userId);
            if (user == null) return NotFound("Không tìm thấy người dùng");

            user.is_admin = true;
            _context.SaveChanges();

            return Ok($"Người dùng {user.user_name} đã được cấp quyền admin");
        }

    }
}

