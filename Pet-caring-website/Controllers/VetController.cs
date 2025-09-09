using BCrypt.Net;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Pet_caring_website.Data;
using Pet_caring_website.DTOs.User;
using Pet_caring_website.Services;
using Pet_caring_website.Models;
using Pet_caring_website.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Pet_caring_website.Controllers
{
    [Authorize(Roles = "vet")]
    [ApiController]
    [Route("api/v1/[Controller]")]
    public class VetController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<AppointmentHub> _hub;

        public VetController(AppDbContext context, IHubContext<AppointmentHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        // 1. Lấy danh sách các lịch hẹn đã Confirmed nhưng chưa có vet nhận
        [HttpGet("list-appointments")]
        public async Task<IActionResult> GetAvailableAppointments()
        {
            var appointments = await _context.Appointments
                .Where(a => a.Status == "Confirmed" && a.VetId == null)
                // load User và ServiceDetail + Service để lấy tên dịch vụ
                .Include(a => a.User)
                .Include(a => a.AppointmentDetails)
                    .ThenInclude(d => d.Svd)
                        .ThenInclude(svd => svd.Service)
                .Select(a => new
                {
                    a.ApId,
                    a.ApDate,
                    a.Notes,
                    Customer = new
                    {
                        a.User.UserId,
                        a.User.FirstName,
                        a.User.LastName
                    },
                    Services = a.AppointmentDetails.Select(d => new
                    {
                        d.SvdId,
                        ServiceName = d.Svd.Service.ServiceName,
                        // subquery lấy tên pet dựa trên d.PetId
                        PetName = _context.Pets
                            .Where(p => p.PetId == d.PetId)
                            .Select(p => p.PetName)
                            .FirstOrDefault()  // nếu không tìm thấy sẽ về null
                    }).ToList()
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // 2. Vet nhận một lịch hẹn
        [HttpPost("claim/{id}")]
        public async Task<IActionResult> Claim(int id)
        {
            // Lấy vetId từ JWT
            if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var vetId))
                return Unauthorized();

            // Kiểm tra vet hiện tại đang có bao nhiêu lịch "đang làm"
            //    Status "InProgress" nghĩa là vet đã nhận nhưng chưa hoàn thành
            var inProgressCount = await _context.Appointments
                .CountAsync(a => a.VetId == vetId && a.Status == "InProgress");
            if (inProgressCount >= 10)
                return BadRequest(new { message = "Bạn đang có quá nhiều lịch hẹn chưa hoàn thành (tối đa 10)." });

            // Lấy appointment và kiểm tra xem có tồn tại, đã được confirmed, và chưa có vet nào nhận
            var appt = await _context.Appointments
                .FirstOrDefaultAsync(a =>
                    a.ApId == id
                    && a.Status == "Confirmed"
                    && a.VetId == null);
            if (appt == null)
                return BadRequest(new { message = "Lịch hẹn không tồn tại hoặc đã có vet nhận." });

            // Kiểm tra trùng giờ hẹn với các lịch đang làm của vet
            //    (nếu bạn có duration thì so sánh khoảng thời gian; ở đây tạm so bằng ApDate)
            var overlap = await _context.Appointments
                .AnyAsync(a => a.VetId == vetId
                               && a.Status == "InProgress"
                               && a.ApDate == appt.ApDate);
            if (overlap)
                return BadRequest(new { message = "Bạn đã có lịch hẹn trùng khung giờ này." });

            // Gán vet và chuyển status sang InProgress
            appt.VetId = vetId;
            appt.Status = "InProgress";
            await _context.SaveChangesAsync();

            // Gửi realtime thông báo cho tất cả vets còn đang online
            await _hub.Clients.Group("vets")
                .SendAsync("AppointmentClaimed", new
                {
                    AppointmentId = appt.ApId,
                    VetId = vetId
                });

            return Ok(new { message = "Bạn đã nhận lịch hẹn thành công." });
        }

    }
}