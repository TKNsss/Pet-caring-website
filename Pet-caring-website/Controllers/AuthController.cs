using Microsoft.AspNetCore.Mvc;
using Pet_caring_website.DTOs.Auth;
using Pet_caring_website.Interfaces;

namespace Pet_caring_website.Controllers
{
    [ApiController]
    // defines the route for the controller
    [Route("api/v1/[controller]")]
    // ControllerBase: the base class for API controllers. It provides methods and properties for handling
    // HTTP requests and responses.
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;         
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDTO request)
        {
            var payload = await _authService.VerifyGoogleTokenAsync(request.IdToken) 
                ?? throw new UnauthorizedAccessException("Invalid Google token.");

            var response = await _authService.LoginWithGoogleAsync(
                request.Email,
                request.FirstName,
                request.LastName,
                request.Picture
            );
            return Ok(response);
        }

        // Đăng ký người dùng xác thực gmail với Otp
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }

        // Đăng nhập bằng email & password
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }

        // Gửi mã OTP để đặt lại mật khẩu
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDTO request)
        {
            var response = await _authService.ForgotPasswordAsync(request);
            return Ok(response);
        }

        // Đặt lại mật khẩu sau khi xác thực OTP
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDTO request)
        {
            var response = await _authService.ResetPasswordAsync(request);
            return Ok(response);
        }
    }
}