using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pet_caring_website.Data;
using Pet_caring_website.DTOs.Appointment;
using Pet_caring_website.Interfaces;
using Pet_caring_website.Models.Appointments;
using Pet_caring_website.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Pet_caring_website.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AppointmentsController(AppDbContext context, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        // POST
        // Tạo lịch hẹn
        [HttpPost()]
        [Authorize]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu không hợp lệ",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            //if (request.ApDate < DateOnly.Now)
            //{
            //    return BadRequest(new { message = "Thời gian hẹn không được nhỏ hơn thời gian hiện tại!" });
            //}

            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Tạo buổi hẹn
                var appointment = new Appointment
                {
                    UserId = userId,
                    //ApDate = request.ApDate.ToLocalTime(),
                    Status = "Pending",
                    Notes = request.Notes,
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                // Tạo danh sách chi tiết hẹn kèm theo thông tin thú cưng và dịch vụ
                var serviceSummaries = new List<(string PetName, string ServiceName)>();

                // Kiểm tra và thêm các chi tiết dịch vụ
                foreach (var service in request.Services)
                {
                    var pet = await _context.Pets
                        .Where(p => p.PetId == service.PetId && p.PetOwners.Any(po => po.UserId == userId))
                        .FirstOrDefaultAsync();

                    var serviceDetail = await _context.ServiceDetails
                        .Include(sd => sd.Service) // Đảm bảo có tên dịch vụ
                        .Where(sd => sd.SvdId == service.ServiceId)
                        .FirstOrDefaultAsync();

                    if (pet == null || serviceDetail?.Service == null)
                    {
                        return BadRequest(new { message = $"Thú cưng hoặc dịch vụ không hợp lệ (PetId: {service.PetId}, ServiceId: {service.ServiceId})" });
                    }

                    // Thêm chi tiết lịch hẹn
                    _context.AppointmentDetails.Add(new AppointmentDetail
                    {
                        ApId = appointment.ApId,
                        PetId = service.PetId,
                        SvdId = service.ServiceId
                    });

                    serviceSummaries.Add((pet.PetName, serviceDetail.Service.ServiceName));
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Gửi email xác nhận sau khi commit 
                var user = await _context.Users.FindAsync(userId);

                if (user != null)
                {
                    // Sử dụng userEntity.Email, tránh null
                    var token = GenerateAppointmentConfirmationToken(appointment.ApId, user?.Email);
                    var confirmationLink = $"{Request.Scheme}://{Request.Host}/api/v1/user/confirm-appointment?token={token}";

                    var servicesInfo = string.Join("<br>", serviceSummaries.Select(s =>
                        $"- Tên thú cưng: <strong>{s.PetName}</strong><br>" +
                        $"- Dịch vụ: <strong>{s.ServiceName}</strong>"));

                    var emailSubject = "Xác nhận lịch hẹn";
                    var emailBody = $@"Chào quý khách {user.UserName},<br><br>
                                    Chúng tôi đã nhận được yêu cầu đặt lịch hẹn sử dụng dịch vụ cho thú cưng với các thông tin sau:<br>
                                    {servicesInfo}<br><br>
                                    Quý khách vui lòng <a href='{confirmationLink}'>bấm vào đây</a> để xác nhận lịch hẹn.<br><br>
                                    Cảm ơn vì đã tin dùng dịch vụ của chúng tôi,<br>Pet Caring Team - Chu đáo từ cái liếm đầu tiên";

                    try
                    {
                        await _emailService.SendConfirmationEmailAsync(user!.Email, emailSubject, emailBody);
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        return StatusCode(500, new
                        {
                            message = "Có lỗi xảy ra khi tạo lịch hẹn!",
                            error = ex.ToString(), // thêm dòng này để in rõ lỗi
                            inner = ex.InnerException?.Message
                        });
                    }
                }

                return Ok(new { message = "Đặt lịch hẹn thành công, vui lòng kiểm tra email để xác nhận trong vòng 1 tiếng." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Có lỗi xảy ra khi tạo lịch hẹn!", error = ex.Message });
            }
        }

        // Chưa có tự động hủy lịch hẹn khi quá hạn (tạo thêm)
        [HttpGet("confirm-appointment")]
        public async Task<IActionResult> ConfirmAppointmentByToken([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token không hợp lệ." });

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var apId = int.Parse(jwtToken.Claims.First(c => c.Type == "appointmentId").Value);

            var appointment = await _context.Appointments.FindAsync(apId);
            if (appointment == null)
            {
                return NotFound(new { message = "Lịch hẹn không tồn tại." });
            }

            if (appointment.Status == "Confirmed")
            {
                return BadRequest(new { message = "Lịch hẹn này đã được xác nhận trước đó." });
            }

            appointment.Status = "Confirmed";
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Lịch hẹn đã được xác nhận thành công." });
        }

        // Hủy lịch hẹn cho người dùng khi chưa xác nhận lịch hẹn
        [HttpDelete("cancel-appointment/{appointmentId}")]
        [Authorize]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            // Tìm lịch hẹn theo appointmentId và đảm bảo nó thuộc về user hiện tại
            var appointment = await _context.Appointments
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.ApId == appointmentId && a.UserId == userId);

            if (appointment == null)
            {
                return NotFound(new { message = "Lịch hẹn không tồn tại hoặc không thuộc về bạn." });
            }

            // Kiểm tra trạng thái để đảm bảo lịch hẹn có thể hủy
            if (appointment.Status != "Pending")
            {
                return BadRequest(new { message = "Lịch hẹn đã được xác nhận hoặc không thể hủy." });
            }

            // Cập nhật trạng thái thành "Cancelled"
            appointment.Status = "Cancelled";
            _context.Appointments.Update(appointment);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Lịch hẹn đã được hủy thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Có lỗi xảy ra khi hủy lịch hẹn.", error = ex.Message });
            }
        }

        // Kiểm tra đăng nhập
        private bool TryGetUserId(out Guid userId)
        {
            userId = Guid.Empty;
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return !string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out userId);
        }

        private string GenerateAppointmentConfirmationToken(int appointmentId, string? email)
        {
            // Kiểm tra null cho email
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email cannot be null or empty", nameof(email));
            }

            // Lấy thông tin từ cấu hình và kiểm tra null
            var jwtKey = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(jwtKey))
                throw new InvalidOperationException("JWT key is missing from configuration.");
            if (string.IsNullOrEmpty(issuer))
                throw new InvalidOperationException("JWT issuer is missing from configuration.");
            if (string.IsNullOrEmpty(audience))
                throw new InvalidOperationException("JWT audience is missing from configuration.");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Tạo claims
            var claims = new[]
            {
                new Claim("appointmentId", appointmentId.ToString()),
                new Claim("email", email)
            };

            // Lấy thời gian hết hạn token từ cấu hình
            if (!int.TryParse(_configuration["Jwt:ExpiryInHours"], out int expiryHours))
                expiryHours = 1;

            // Tạo token
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiryHours),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
