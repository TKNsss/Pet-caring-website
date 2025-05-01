using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Pet_caring_website.Data;
using Pet_caring_website.Models;
using Pet_caring_website.Services;
using Pet_caring_website.DTOs.Auth;

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

        // Đăng nhập Google
        [HttpGet("login-google")]
        public IActionResult LoginWithGoogle()
        {
            var redirectUrl = Url.Action(nameof(GoogleResponse), "Auth", null, Request.Scheme);
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        // Xử lý phản hồi từ Google
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

            // Tạo JWT Token
            var token = GenerateJwtToken(user);
            var fe = _configuration["Jwt:Audience"];
            var frontendUrl = $"{fe}/login?token={token}";

            return Redirect(frontendUrl);
        }

        // Đăng ký người dùng xác thực gmail với Otp
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Email đã tồn tại" });

            // Nếu chưa có OTP được cung cấp, gửi OTP qua email
            if (string.IsNullOrEmpty(request.OtpCode))
            {
                // Tạo OTP
                var otp = _otpService.GenerateOtp(request.Email);
                // Gửi OTP qua email với subject "register"
                _emailService.SendOtpEmail(request.Email, otp, "register");
                return Ok(new { message = "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email để hoàn tất đăng ký." });
            }
            else
            {
                // Nếu đã có OTP, xác thực OTP
                if (!_otpService.VerifyOtp(request.Email, request.OtpCode))
                    return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn." });

                var newUser = new User
                {
                    UserId = Guid.NewGuid(),
                    UserName = request.UserName,
                    Email = request.Email,
                    Password = PasswordService.HashPassword(request.Password),
                    Role = "client"
                };

                try
                {
                    _context.Users.Add(newUser);
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Đăng ký thành công." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Lỗi khi lưu thông tin người dùng: {ex.Message}");
                }
            }
        }

        // Đăng nhập bằng email & password
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

                // Kiểm tra user tồn tại và password không null
            if (existingUser == null || string.IsNullOrEmpty(existingUser.Password) ||
                !PasswordService.VerifyPassword(request.Password, existingUser.Password))
            {
                return Unauthorized(new { message = "Thông tin đăng nhập không chính xác" });
            }

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

        // Gán quyền cho user
        [HttpPost("assign-role")]
        [Authorize]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest request)
        {
            // Lấy email Super Admin từ appsettings.json
            var superAdminEmail = _configuration["SuperAdmins:Email"];

            // Lấy email của user đang đăng nhập
            var loggedInUserEmail = User.FindFirstValue(ClaimTypes.Email);

            // Kiểm tra user có phải Super Admin không
            if (loggedInUserEmail == null || loggedInUserEmail != superAdminEmail)
            {
                return Forbid(); // Trả về lỗi 403 Forbidden
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return NotFound(new { message = "Người dùng không tồn tại!" });

            // Chỉ cho phép gán các quyền hợp lệ
            var validRoles = new List<string> { "admin", "vet", "client" };
            if (!validRoles.Contains(request.Role.ToLower()))
                return BadRequest(new { message = "Quyền không hợp lệ! Chỉ chấp nhận: admin, vet, client" });

            user.Role = request.Role.ToLower();
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã gán quyền '{user.Role}' cho {user.Email}" });
        }

        // Gửi mã OTP để đặt lại mật khẩu
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || !IsValidEmail(request.Email))
                return BadRequest(new { message = "Email không hợp lệ." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return NotFound(new { message = "Email không tồn tại trong hệ thống." });

            try
            {
                var otp = _otpService.GenerateOtp(request.Email);
                _emailService.SendOtpEmail(request.Email, otp, "reset-password");

                return Ok(new { message = "Mã OTP đã được gửi đến email của bạn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi gửi email: {ex.Message}");
            }
        }

        // Đặt lại mật khẩu sau khi xác thực OTP
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!_otpService.VerifyOtp(request.Email, request.OtpCode))
                return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null) 
                return NotFound(new { message = "Email không tồn tại trong hệ thống." });

            try
            {
                // Step 1: Generate a new random password
                string newPassword = PasswordService.GenerateRandomPassword();

                // Step 2: Hash the new password
                string hashedPassword = PasswordService.HashPassword(newPassword);

                // Step 3: Update the user's password in the database
                user.Password = hashedPassword;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                // Step 4: Send the new password to the user's email
                _emailService.SendOtpEmail(request.Email, newPassword, "new-password");

                return Ok(new { message = "Mật khẩu mới đã được gửi đến email của bạn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi gửi email: {ex.Message}");
            }
        }

        // Kiểm tra email có đúng định dạng không
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        // Tạo JWT Token
        private string GenerateJwtToken(User user)
        {
            // Lấy thông tin từ cấu hình appsetting.json
            var jwtKey = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            // Kiểm tra null cho các giá trị cấu hình
            if (string.IsNullOrEmpty(jwtKey))
                throw new InvalidOperationException("JWT key is missing from configuration.");
            if (string.IsNullOrEmpty(issuer))
                throw new InvalidOperationException("JWT issuer is missing from configuration.");
            if (string.IsNullOrEmpty(audience))
                throw new InvalidOperationException("JWT audience is missing from configuration.");

            // Converts it into bytes and creates a SymmetricSecurityKey.
            // SymmetricSecurityKey means the same key is used for both signing and verifying the token.
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            // Uses the secret key to create SigningCredentials using HMAC SHA-256
            // Ensures the integrity of the token.
            // The recipient can verify that the token was generated by the server and not tampered with.
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // A claim is a key - value pair that holds user information.
            // Defines the payload(data) stored inside the JWT token.
            // Tạo claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? string.Empty)
            };

            if (!string.IsNullOrEmpty(user.Email))
            {
                claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
            }

            // Retrieves the expiration time from appsettings.json (Jwt:ExpiryInHours).
            // JWT tokens should expire after a certain time to improve security. 
            // Set token expiration (default to 3 hours if missing)
            if (!int.TryParse(_configuration["Jwt:ExpiryInHours"], out int expiryHours))
                expiryHours = 3;

            var token = new JwtSecurityToken(
                issuer: issuer, // server issued the token
                audience: audience, // client that is allowed to use the token
                claims: claims, // User's claims (user's data)
                expires: DateTime.UtcNow.AddHours(expiryHours),
                signingCredentials: credentials // Signing key (HMAC SHA-256) - The security key used to sign the token
            );
            // returns the converted JwtSecurityToken object as a string.
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
    