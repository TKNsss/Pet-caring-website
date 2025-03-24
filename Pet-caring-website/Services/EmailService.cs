using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Caching.Memory;

namespace Pet_caring_website.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache;

        public EmailService(IConfiguration config, IMemoryCache cache)
        {
            _config = config;
            _cache = cache;
        }

        public void SendOtpEmail(string email)
        {
            string otp = new Random().Next(100000, 999999).ToString();
            _cache.Set(email, otp, TimeSpan.FromMinutes(5)); // OTP có hiệu lực 5 phút

            var smtpClient = new SmtpClient(_config["Email:SmtpServer"])
            {
                Port = int.Parse(_config["Email:Port"]),
                Credentials = new NetworkCredential(_config["Email:Username"], _config["Email:Password"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["Email:Username"]),
                Subject = "Mã OTP của bạn",
                Body = $"Mã OTP của bạn là: {otp}. Mã có hiệu lực trong 5 phút.",
                IsBodyHtml = false,
            };

            mailMessage.To.Add(email);
            smtpClient.Send(mailMessage);
        }

        public bool VerifyOtp(string email, string otp)
        {
            if (_cache.TryGetValue(email, out string? cachedOtp))
            {
                if (cachedOtp == otp)
                {
                    _cache.Remove(email);
                    return true;
                }
            }
            return false;
        }
    }
}
