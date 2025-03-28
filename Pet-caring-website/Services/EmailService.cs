using System;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Pet_caring_website.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public void SendOtpEmail(string toEmail, string otp)
        {
            // Kiểm tra email có hợp lệ không
            if (string.IsNullOrEmpty(toEmail))
            {
                throw new ArgumentException("Địa chỉ email không được để trống.", nameof(toEmail));
            }

            var fromEmail = _config["EmailSettings:Username"];
            var password = _config["EmailSettings:Password"];

            _logger.LogInformation($"[EmailService] Sending OTP to: {toEmail}");
            _logger.LogInformation($"[EmailService] Email: {fromEmail}");
            _logger.LogInformation($"[EmailService] SMTP Server: smtp.gmail.com, Port: 587, SSL: true");
            _logger.LogInformation($"[EmailService] Mật khẩu SMTP {(string.IsNullOrEmpty(password) ? "NULL" : "Đã nhận")}");



            if (string.IsNullOrEmpty(fromEmail) || string.IsNullOrEmpty(password))
            {
                throw new InvalidOperationException("Thông tin Email hoặc mật khẩu SMTP không được cấu hình.");
            }

            try
            {
                using var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(fromEmail, password),
                    EnableSsl = true,
                    UseDefaultCredentials = false
                };

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail),
                    Subject = "Mã OTP xác thực",
                    Body = $"<p>Mã OTP của bạn là: <strong>{otp}</strong></p><p>OTP này có hiệu lực trong 5 phút.</p>",
                    IsBodyHtml = true
                };

                mailMessage.To.Add(new MailAddress(toEmail));

                smtpClient.Send(mailMessage);
                _logger.LogInformation($"OTP đã được gửi tới {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EmailService] Lỗi khi gửi email tới {toEmail}: {ex.Message} \n {ex.StackTrace}");
                throw new InvalidOperationException($"Không thể gửi email. Chi tiết lỗi: {ex.Message}");
            }
        }
    }
}
