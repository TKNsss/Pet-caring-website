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
// using Pet_caring_website.DTOs.User.PetProfile;
// using Pet_caring_website.DTOs.User.UserProfile;
// using Pet_caring_website.DTOs.User.Appointment;
using Pet_caring_website.Services;
using Pet_caring_website.Models;

namespace Pet_caring_website.Controllers
{
    [Authorize(Roles = "vet")]
    [ApiController]
    [Route("api/v1/[Controller]")]
    public class VetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VetController(AppDbContext context)
        {
            _context = context;
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
        [HttpPost("appointments/{id}/accept")]
        public async Task<IActionResult> AcceptAppointment(int id)
        {
            // Lấy vetId từ token
            var vetIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(vetIdClaim) || !Guid.TryParse(vetIdClaim, out Guid vetId))
                return Unauthorized(new { message = "Bạn chưa đăng nhập." });

            // Kiểm tra vet đã có cuộc hẹn nào đang xử lý chưa (Status != Cancelled/Completed)
            var inProgressCount = await _context.Appointments
                .CountAsync(a => a.VetId == vetId && a.Status == "Assigned");
            if (inProgressCount > 0)
                return BadRequest(new { message = "Bạn đang có một lịch hẹn đang xử lý. Hoàn thành rồi mới nhận thêm." });

            // Lấy cuộc hẹn
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.ApId == id && a.Status == "Confirmed" && a.VetId == null);
            if (appointment == null)
                return NotFound(new { message = "Lịch hẹn không tồn tại hoặc đã được nhận." });

            // Gán vet và đổi trạng thái
            appointment.VetId = vetId;
            appointment.Status = "Assigned";

            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Bạn đã nhận lịch hẹn thành công.", appointmentId = id });
        }
    }
}
