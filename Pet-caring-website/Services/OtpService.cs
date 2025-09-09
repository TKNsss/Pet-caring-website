using Microsoft.Extensions.Caching.Memory;
using Pet_caring_website.Interfaces;
/*
    In-Memory Caching (IMemoryCache)

    - Caches data in the memory (RAM) of the current web server.
    - Very fast and efficient for single-server deployments.
    - Data is lost when the application restarts or is deployed to multiple servers without sharing memory.
    -> Ideal for small-scale apps or apps running on a single server (e.g., local deployments, monoliths).
*/

namespace Pet_caring_website.Services
{
    public class OtpService : IOtpService
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<OtpService> _logger;

        public OtpService(IMemoryCache cache, ILogger<OtpService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public string GenerateOtp(string email)
        {
            var otp = new Random().Next(100000, 999999).ToString();  // Tạo OTP 6 số
            _cache.Set(email, otp, TimeSpan.FromMinutes(5));  // Lưu OTP trong 5 phút

            _logger.LogInformation("[OtpService] OTP generated for {Email}: {Otp}", email, otp);

            return otp;
        }

        public bool VerifyOtp(string email, string otp)
        {
            if (_cache.TryGetValue(email, out string? storedOtp))
            {
                if (storedOtp == otp)
                {
                    _cache.Remove(email);  // Remove OTP after successful verification
                    _logger.LogInformation("[OtpService] OTP verified successfully for {Email}", email);
                    return true;
                }

                _logger.LogWarning("[OtpService] Invalid OTP entered for {Email}", email);
            }
            else
            {
                _logger.LogWarning("[OtpService] No OTP found or expired for {Email}", email);
            }

            return false;
        }

    }
}
