// IOptions: provides a way to access configuration settings in a strongly typed manner, uses DI.
using Microsoft.Extensions.Options;
using Pet_caring_website.Configurations;
using Pet_caring_website.Interfaces;
using System.Net;
using System.Net.Mail;

namespace Pet_caring_website.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> options, ILogger<EmailService> logger)
        {
            _emailSettings = options.Value;
            _logger = logger;
        }

        public async Task SendOtpViaEmailAsync(string toEmail, string contentValue, string subjectType)
        {
            if (string.IsNullOrEmpty(toEmail))
                throw new ArgumentException("Email cannot be empty.", nameof(toEmail));

            var (subject, body) = BuildEmailContent(subjectType, contentValue);
            await SendEmailInternalAsync(toEmail, subject, body);
        }

        public async Task SendConfirmationEmailAsync(string toEmail, string subject, string body)
        {
            if (string.IsNullOrEmpty(toEmail))
                throw new ArgumentException("Email cannot be empty.", nameof(toEmail));

            await SendEmailInternalAsync(toEmail, subject, body);
        }

        // (): uses tuple (as type) to return both subject and body
        private (string subject, string body) BuildEmailContent(string type, string contentValue)
        {
            return type switch
            {
                "register" => (
                    "Xác nhận đăng ký tài khoản",
                    $"<p>Chào mừng bạn đến với hệ thống của chúng tôi!</p>" +
                    $"<p>Mã OTP đăng ký của bạn là: <strong>{contentValue}</strong></p>" +
                    $"<p>Vui lòng nhập mã này để hoàn tất đăng ký. Mã có hiệu lực trong <strong>5 phút.</strong></p>"
                ),
                "reset-password" => (
                    "Mã OTP đặt lại mật khẩu",
                    $"<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>" +
                    $"<p>Mã OTP của bạn là: <strong>{contentValue}</strong></p>" +
                    $"<p>OTP này có hiệu lực trong <strong>5 phút</strong></p>"
                ),
                "new-password" => (
                    "Mật khẩu mới",
                    $"<p>Mật khẩu của bạn là: <strong>{contentValue}</strong></p>"
                ),
                _ => throw new ArgumentException("Invalid email type.", nameof(type))
            };
        }

        private async Task SendEmailInternalAsync(string toEmail, string subject, string body)
        {
            if (string.IsNullOrEmpty(_emailSettings.SmtpUser) || string.IsNullOrEmpty(_emailSettings.SmtpPassword))
                throw new InvalidOperationException("SMTP credentials are not configured.");

            _logger.LogInformation(
               "[EmailService] Sending email | To: {To} | Subject: {Subject} | SMTP: {Smtp}:{Port} (SSL={SSL})",
               toEmail,
               subject,
               _emailSettings.SmtpServer,
               _emailSettings.SmtpPort,
               _emailSettings.EnableSsl
            );

            try
            {
                using var smtpClient = new SmtpClient(_emailSettings.SmtpServer)
                {
                    Port = _emailSettings.SmtpPort,
                    EnableSsl = _emailSettings.EnableSsl,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(_emailSettings.SmtpUser, _emailSettings.SmtpPassword)
                };

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.SmtpUser),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation("[Email Service] Email sent to {ToEmail}", toEmail);
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, "[Email Service] SMTP error when sending email to {ToEmail}", toEmail);
                throw new InvalidOperationException("Failed to send email due to SMTP error.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[Email Service] Unexpected error when sending email to {ToEmail}", toEmail);
                throw new InvalidOperationException("Failed to send email due to an unexpected error.");
            }
        }
    }
}
