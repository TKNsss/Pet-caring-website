using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pet_caring_website.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Pet_caring_website.DTOs.User;

namespace Pet_caring_website.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // Get user profile
        [HttpGet("profile")]
        [Authorize] // Ensures only authenticated users can access this API.
        public async Task<IActionResult> GetUserProfile()
        {
            // The JWT token is automatically extracted by ASP.NET from the request.
            // Extracts the user's ID from the JWT token.
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            // Query the Database for User Information
            var user = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    u.UserId,
                    u.UserName,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Phone,
                    u.Address,
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
        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại" });
            }

            // Cập nhật thông tin cơ bản
            user.UserName = request.UserName ?? user.UserName;
            user.FirstName = request.FirstName ?? user.FirstName;
            user.LastName = request.LastName ?? user.LastName;
            user.Phone = request.Phone ?? user.Phone;
            user.Address = request.Address ?? user.Address;

            // Nếu user có role là "vet", mới cho phép cập nhật speciality
            if (user.Role == "vet" && !string.IsNullOrEmpty(request.Speciality))
            {
                user.Speciality = request.Speciality;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin thành công" });
        }
    }
}
