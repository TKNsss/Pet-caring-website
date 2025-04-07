using System.Net;
using System.Net.Mail;

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

        public void SendOtpEmail(string toEmail, string otp, string subjectType)
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

            // Xác định tiêu đề và nội dung email theo loại OTP
            string subject, body;

            if (subjectType == "register")
            {
                subject = "Xác nhận đăng ký tài khoản";
                body = $"<p>Chào mừng bạn đến với hệ thống của chúng tôi!</p>" +
                       $"<p>Mã OTP đăng ký của bạn là: <strong>{otp}</strong></p>" +
                       $"<p>Vui lòng nhập mã này để hoàn tất đăng ký. Mã có hiệu lực trong <strong>5 phút.</strong></p>";
            }
            else if (subjectType == "reset-password")
            {
                subject = "Mã OTP đặt lại mật khẩu";
                body = $"<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>" +
                       $"<p>Mã OTP của bạn là: <strong>{otp}</strong></p>" +
                       $"<p>OTP này có hiệu lực trong <strong>5 phút</strong></p>";
            }
            else if (subjectType == "new-password") 
            {
                subject = "Mật khẩu mới";
                body = $"<p>Mật khẩu của bạn là: <strong>{otp}</strong></p>";
            }
            else
            {
                throw new ArgumentException("Loại email không hợp lệ.", nameof(subjectType));
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
                    Subject = subject,
                    Body = body,
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
