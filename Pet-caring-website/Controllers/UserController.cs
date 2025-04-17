using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pet_caring_website.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Pet_caring_website.DTOs.User;
using Pet_caring_website.Services;

namespace Pet_caring_website.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ImageService _imageService;

        public UserController(AppDbContext context, EmailService emailService, IConfiguration configuration, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // Get user profile
        [HttpGet("profile")]
        [Authorize] // Ensures only authenticated users can access this API.
        public async Task<IActionResult> GetUserProfile()
        {
            // The JWT token is automatically extracted by ASP.NET from the request.
            // Extracts the user's ID from the JWT token.
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            // Query the Database for User Information
            var user = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    user_id = u.UserId,
                    username = u.UserName,
                    email = u.Email,
                    firstname = u.FirstName,
                    lastname = u.LastName,
                    phone = u.Phone,
                    address = u.Address,
                    avatar_url = u.AvatarUrl,
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "Người dùng không tồn tại" });

            return Ok(new
            {
                message = "Lấy thông tin người dùng thành công",
                user
            });
        }

        // Update user profile
        [HttpPatch("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại" });
            }

            // ✔️ only update fields that are explicitly provided and not null in the request.
            // ✔️ Empty strings like "" are allowed and will be updated.
            // ❌ Fields that are not included (left undefined / null) will be skipped.
            if (request.UserName != null)
                user.UserName = request.UserName.Trim();

            if (request.FirstName != null)
                user.FirstName = request.FirstName.Trim();

            if (request.LastName != null)
                user.LastName = request.LastName.Trim();

            if (request.Phone != null)
                user.Phone = request.Phone?.Trim();  

            if (request.Address != null)
                user.Address = request.Address.Trim();

            if (user.Role?.ToLower() == "vet" && request.Speciality != null)
                user.Speciality = request.Speciality.Trim();

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thông tin thành công",
                user = new
                {
                    username = user.UserName,
                    firstname = user.FirstName,
                    lastname = user.LastName,
                    phone = user.Phone,
                    email = user.Email,
                    address = user.Address,
                }
            });
        }

        // Đổi mật khẩu khi người dùng vẫn còn phiên đăng nhập
        [HttpPatch("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {            
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return Unauthorized(new { message = "Người dùng không tồn tại." });

            if (user.Password == null)
            {
                return BadRequest(new { message = "Người dùng không có mật khẩu. Hãy chọn quên mật khẩu để tạo!" });
            }

            if (!PasswordService.VerifyPassword(request.OldPassword, user.Password))
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
            }

            if (request.OldPassword == request.NewPassword)
            {
                return BadRequest(new { message = "Mật khẩu mới không được giống mật khẩu cũ." });
            }

            // Cập nhật mật khẩu mới sau khi đã hash
            user.Password = PasswordService.HashPassword(request.NewPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công." });
        }

        [HttpPost("upload-avatar")]
        [Authorize]
        public async Task<IActionResult> UploadAvatar([FromForm(Name = "img")] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { error = "No image file provided." });

            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
                {
                    return Unauthorized(new { message = "Bạn chưa đăng nhập" });
                }
                var result = await _imageService.UploadUserAvatarAsync(image, userId.ToString());

                if (result == null)
                {
                    return StatusCode(500, new { error = "Error uploading avatar. Please try again later." });
                }
                var avatarUrl = result.SecureUrl.ToString();
                var user = await _context.Users.FindAsync(userId);

                if (user != null)
                {
                    user.AvatarUrl = avatarUrl;
                    await _context.SaveChangesAsync();
                }

                return Ok(new
                {
                    message = "Upload avatar successfully.",
                    url = avatarUrl,
                    publicId = result.PublicId
                });
            }
            catch (InvalidOperationException ex)
            {
                // For validation errors (e.g., file too large, invalid type)
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                // For unexpected errors (e.g., Cloudinary errors, stream issues)
                return StatusCode(500, new { error = "An error occurred while uploading the image.", details = ex.Message });
            }
        }

        [HttpDelete("delete-acc")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa tài khoản thành công" });
        }

        // Kiểm tra đăng nhập
        private bool TryGetUserId(out Guid userId)
        {
            userId = Guid.Empty;
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return !string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out userId);
        }
    }
}
