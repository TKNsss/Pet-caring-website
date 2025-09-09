namespace Pet_caring_website.Interfaces
{
    public interface IOtpService
    {
        string GenerateOtp(string email);
        bool VerifyOtp(string email, string otp);
    }
}
