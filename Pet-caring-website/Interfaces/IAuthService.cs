using Google.Apis.Auth;
using Pet_caring_website.DTOs.Auth;

namespace Pet_caring_website.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request);
        Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request);
        Task<AuthResponseDTO> ForgotPasswordAsync(ForgotPasswordRequestDTO request);
        Task<AuthResponseDTO> ResetPasswordAsync(ResetPasswordRequestDTO request);
        Task<GoogleJsonWebSignature.Payload?> VerifyGoogleTokenAsync(string idToken);
        Task<AuthResponseDTO> LoginWithGoogleAsync(string email, string? firstName, string? lastName, string? picture);
        Task<AuthResponseDTO> LoginWithGitHubAsync(string code, string? state);
    }
}
