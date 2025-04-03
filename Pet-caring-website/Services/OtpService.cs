using System;
using Microsoft.Extensions.Caching.Memory;

namespace Pet_caring_website.Services
{
    public class OtpService
    {
        private readonly IMemoryCache _cache;

        public OtpService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string GenerateOtp(string email)
        {
            var otp = new Random().Next(100000, 999999).ToString();  // Tạo OTP 6 số
            _cache.Set(email, otp, TimeSpan.FromMinutes(5));  // Lưu OTP trong 5 phút
            return otp;
        }

        public bool VerifyOtp(string email, string otp)
        {
            if (_cache.TryGetValue(email, out string? storedOtp))
            {
                return storedOtp == otp;
            }
            return false;
        }
    }
}
