using AutoMapper;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Pet_caring_website.Configurations;
using Pet_caring_website.Data;
using Pet_caring_website.DTOs.Auth;
using Pet_caring_website.DTOs.User;
using Pet_caring_website.Helpers;
using Pet_caring_website.Interfaces;
using Pet_caring_website.Models;

namespace Pet_caring_website.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IOtpService _otpService;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly GoogleAuthSettings _googleAuthSettings;
        private readonly IMapper _mapper;

        public AuthService(AppDbContext context, IOtpService otpService, IEmailService emailService, IJwtService jwtService, IOptions<GoogleAuthSettings> googleAuthSetting, IMapper mapper)
        {
            _context = context;
            _jwtService = jwtService;
            _otpService = otpService;
            _emailService = emailService;
            _googleAuthSettings = googleAuthSetting.Value;
            _mapper = mapper;
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request)
        {
            // check if email exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new ArgumentException("Email already exists.");

            // If no OTP provided → send OTP
            if (string.IsNullOrEmpty(request.OtpCode))
            {
                var otp = _otpService.GenerateOtp(request.Email);
                await _emailService.SendOtpViaEmailAsync(request.Email, otp, "register");
                return new AuthResponseDTO
                {
                    Message = "OTP sent to your email. Please check your inbox to complete registration.",
                    User = new UserInfoDTO
                    {
                        Email = request.Email
                    }
                };
            }

            if (!_otpService.VerifyOtp(request.Email, request.OtpCode))
                throw new ArgumentException("Invalid or expired OTP.");

            var newUser = _mapper.Map<User>(request);
            // After AutoMapper runs, we manually set critical fields (hashed password, role, ID).
            // This keeps security - sensitive and system-generated values 'under our control'.
            newUser.UserId = Guid.NewGuid();
            newUser.Password = PasswordHandler.HashPassword(request.Password);
            newUser.Role = "client";

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(newUser);

            return new AuthResponseDTO
            {
                Message = "Registration successful.",
                Token = token,
                User = _mapper.Map<UserInfoDTO>(newUser)
            };
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || string.IsNullOrEmpty(user.Password) ||
                !PasswordHandler.VerifyPassword(request.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Invalid login credentials.");
            }

            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDTO
            {
                Message = "Login successful.",
                Token = token,
                User = _mapper.Map<UserInfoDTO>(user)
            };
        }

        // Verifies the Google ID Token
        public async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleTokenAsync(string idToken)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _googleAuthSettings.ClientId } // Only accept tokens for our app
                };
                return await GoogleJsonWebSignature.ValidateAsync(idToken, settings); // return payload
            }
            catch
            {
                return null; // Invalid or expired token
            }
        }

        public async Task<AuthResponseDTO> LoginWithGoogleAsync(
            string email,
            string? firstName,
            string? lastName,
            string? picture)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                user = new User
                {
                    UserId = Guid.NewGuid(),
                    UserName = email,
                    Email = email.ToLower(),
                    FirstName = firstName,
                    LastName = lastName,
                    AvatarUrl = picture,
                    Password = null, // No password for OAuth users
                    Role = "client"
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            // Generate JWT
            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDTO
            {
                Message = "Google login successful.",
                Token = token,
                User = _mapper.Map<UserInfoDTO>(user)
            };
        }

        public async Task<AuthResponseDTO> ForgotPasswordAsync(ForgotPasswordRequestDTO request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email) 
                ?? throw new KeyNotFoundException("Email is not existed in the system.");

            var otp = _otpService.GenerateOtp(request.Email);
            await _emailService.SendOtpViaEmailAsync(request.Email, otp, "reset-password");

            return new AuthResponseDTO
            {
                Message = "OTP sent to your email. Please check your inbox to reset your password.",
                User = new UserInfoDTO { Email = request.Email }
            };
        }

        public async Task<AuthResponseDTO> ResetPasswordAsync(ResetPasswordRequestDTO request)
        {
            if (!_otpService.VerifyOtp(request.Email, request.OtpCode))
                throw new ArgumentException("Invalid or expired OTP.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email) 
                ?? throw new KeyNotFoundException("Email is not existed in the system.");

            // Generate and hash new password
            string newPassword = PasswordHandler.GenerateRandomPassword();
            user.Password = PasswordHandler.HashPassword(newPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Send new password via email
            await _emailService.SendOtpViaEmailAsync(request.Email, newPassword, "new-password");

            return new AuthResponseDTO
            {
                Message = "Password reset successful. New password has been sent to your email.",
                User = new UserInfoDTO { Email = request.Email }
            };
        }
    }
}
