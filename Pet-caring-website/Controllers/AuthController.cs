using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;
using Pet_caring_website.Data;
using Pet_caring_website.Models;
using Pet_caring_website.DTOs;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Linq;

namespace Pet_caring_website.Controllers
{
    // This attribute marks the class as an API controller.
    [ApiController]
    // defines the route for the controller
    [Route("api/v1/[controller]")]
    // ControllerBase: the base class for API controllers.It provides methods and properties for handling HTTP requests and responses.
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        // The AppDbContext is injected into the controller using Dependency Injection
        // This allows us to interact with the database.
        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

        // Xử lý yêu cầu đăng ký
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
                return Ok(new { message = "Đăng ký thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lưu thông tin người dùng" });
            }
        }

        // Xử lý yêu cầu đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser == null || !VerifyPassword(request.Password, existingUser.Password))
                return Unauthorized(new { message = "Thông tin đăng nhập không chính xác!" });

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

        // API đăng xuất
        [HttpPost("logout")]
        public IActionResult Logout()
        { 
            return Ok(new { message = "Đăng xuất thành công!" });
        }

        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

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

        // Cấp quyền admin
        //[HttpPost("grant-admin/{userId}")]
        //public async Task<IActionResult> GrantAdmin(Guid userId)
        //{
        //    var requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    var requestingUser = await _context.Users.FindAsync(Guid.Parse(requestingUserId));

        //    if (requestingUser == null || !requestingUser.is_admin)
        //        return Unauthorized("Bạn không có quyền cấp admin");

        //    var user = await _context.Users.FindAsync(userId);
        //    if (user == null) return NotFound("Không tìm thấy người dùng");

        //    user.is_admin = true;
        //    await _context.SaveChangesAsync();

        //    return Ok($"Người dùng {user.user_name} đã được cấp quyền admin");
        //}

        // Thu hồi quyền admin
        //[HttpPost("revoke-admin/{userId}")]
        //public IActionResult RevokeAdmin(Guid userId)
        //{
        //    var requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    var requestingUser = _context.Users.Find(Guid.Parse(requestingUserId));

        //    if (requestingUser == null || !requestingUser.is_admin)
        //        return Unauthorized("Bạn không có quyền thực hiện thao tác này");

        //    var user = _context.Users.Find(userId);
        //    if (user == null) return NotFound("Không tìm thấy người dùng");

        //    if (!user.is_admin)
        //        return BadRequest("Người dùng này không phải admin");

        //    user.is_admin = false;
        //    _context.SaveChanges();

        //    return Ok($"Quyền admin của {user.user_name} đã bị thu hồi");
        //}
    }
}
