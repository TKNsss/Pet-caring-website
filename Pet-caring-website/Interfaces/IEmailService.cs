namespace Pet_caring_website.Interfaces
{
    public interface IEmailService
    {
        Task SendOtpViaEmailAsync(string toEmail, string contentValue, string subjectType);
        Task SendConfirmationEmailAsync(string toEmail, string subject, string body);
    }
}
