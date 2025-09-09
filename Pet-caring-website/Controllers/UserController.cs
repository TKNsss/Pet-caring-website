using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pet_caring_website.DTOs.User;
using Pet_caring_website.Interfaces;

namespace Pet_caring_website.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Get user profile
        [Authorize(Roles = "client")] // Ensures only authenticated users can access this API.
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var profile = await _userService.GetUserProfileAsync();

            return Ok(new
            {
                message = "User profile retrieved successfully",
                data = profile
            });
        }

        // Update user profile
        [HttpPatch("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequestDTO request)
        {
            var updatedUser = await _userService.UpdateUserProfileAsync(request);

            return Ok(new
            {
                message = "Profile updated successfully.",
                data = updatedUser
            });
        }

        // Đổi mật khẩu khi người dùng vẫn còn phiên đăng nhập
        [HttpPatch("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDTO request)
        {
            await _userService.ChangePasswordAsync(request);
            return Ok(new { message = "Đổi mật khẩu thành công." });
        }

        [HttpPost("upload-avatar")]
        [Authorize]
        public async Task<IActionResult> UploadAvatar([FromForm(Name = "img")] IFormFile image)
        {
            var response = await _userService.UploadAvatarAsync(image);

            return Ok(new
            {
                message = "Upload avatar successfully.",
                data = response
            });
        }

        //[HttpDelete("delete-acc")]
        //[Authorize]
        //public async Task<IActionResult> DeleteAccount()
        //{
        //    if (!VerifyUserRole.TryGetUserInfo(User, out Guid userId, out string? role))
        //    {
        //        return Unauthorized(new { message = "Bạn chưa đăng nhập" });
        //    }

        //    var user = await _context.Users.FindAsync(userId);
        //    if (user == null)
        //    {
        //        return NotFound(new { message = "Người dùng không tồn tại" });
        //    }

        //    _context.Users.Remove(user);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "Xóa tài khoản thành công" });
        //}
    }
}
