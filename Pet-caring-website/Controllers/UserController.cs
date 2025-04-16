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
using Pet_caring_website.DTOs.User.PetProfile;
using Pet_caring_website.DTOs.User.UserProfile;
using Pet_caring_website.DTOs.User.Appointment;
using Pet_caring_website.Services;
using Pet_caring_website.Models;

namespace Pet_caring_website.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;

        public UserController(AppDbContext context, EmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        // Get user profile
        [HttpGet("profile")]
        [Authorize] // Ensures only authenticated users can access this API.
        public async Task<IActionResult> GetUserProfile()
        {
            // The JWT token is automatically extracted by ASP.NET from the request.
            // Extracts the user's ID from the JWT token.
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            // Query the Database for User Information
            var user = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    u.UserId,
                    u.UserName,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Phone,
                    u.Address,
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "Người dùng không tồn tại" });

            return Ok(new
            {
                message = "Lấy thông tin người dùng thành công",
                user
            });
        }

        // Update user profile
        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại" });
            }

            // Cập nhật thông tin cơ bản
            user.UserName = request.UserName ?? user.UserName;
            user.FirstName = request.FirstName ?? user.FirstName;
            user.LastName = request.LastName ?? user.LastName;
            user.Phone = request.Phone ?? user.Phone;
            user.Address = request.Address ?? user.Address;

            // Nếu user có role là "vet", mới cho phép cập nhật speciality
            if (user.Role == "vet" && !string.IsNullOrEmpty(request.Speciality))
            {
                user.Speciality = request.Speciality;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin thành công" });
        }

        // Đổi mật khẩu khi người dùng vẫn còn phiên đăng nhập
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu không hợp lệ.",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            // Lấy userId từ token và chuyển sang Guid
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Thông tin người dùng không hợp lệ." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return Unauthorized(new { message = "Người dùng không tồn tại." });
            }

            // So sánh mật khẩu cũ (sử dụng BCrypt để verify)
            if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password))
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
            }

            // Cập nhật mật khẩu mới sau khi đã hash
            user.Password = PasswordService.HashPassword(request.NewPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công." });
        }


        [HttpDelete("delete-acc")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa tài khoản thành công" });
        }

        // Thêm mới pet
        [HttpPost("create-pet-profile")]
        [Authorize]
        public async Task<IActionResult> CreatePet([FromBody] CreatePetRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu không hợp lệ.",
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            // Lấy UserId từ token
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync(); // Mở transaction

            try
            {
                // Tạo Pet
                var pet = new Pet
                {
                    SpcId = request.SpcId,
                    PetName = request.PetName,
                    Breed = request.Breed,
                    Age = request.Age,
                    Gender = request.Gender,
                    Weight = request.Weight,
                    Notes = request.Notes
                };

                _context.Pets.Add(pet);
                await _context.SaveChangesAsync(); // Lưu để có PetId

                // Tạo PetOwner liên kết với User hiện tại
                var petOwner = new PetOwner
                {
                    PetId = pet.PetId,
                    UserId = userId
                };

                _context.PetOwners.Add(petOwner);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync(); // Commit nếu không lỗi

                return Ok(new { message = "Thêm hồ sơ thú cưng thành công!", petId = pet.PetId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // Rollback nếu có lỗi
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi thêm thú cưng.", error = ex.Message });
            }
        }


        [HttpPut("update-pet-profile/{petId}")]
        [Authorize]
        public async Task<IActionResult> UpdatePetProfile(int petId, [FromBody] UpdatePetRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ!" });
            }

            // Lấy userId từ token
            if (!TryGetUserId(out Guid userId))
            {
                return Unauthorized(new { message = "Bạn chưa đăng nhập" });
            }

            // Kiểm tra thú cưng có thuộc quyền sở hữu không
            var pet = await _context.Pets
                .Include(p => p.PetOwners)
                .FirstOrDefaultAsync(p => p.PetId == petId && p.PetOwners.Any(po => po.UserId == userId));

            if (pet == null)
            {
                return NotFound(new { message = "Không tìm thấy thú cưng hoặc bạn không có quyền chỉnh sửa!" });
            }

            // Cập nhật thông tin (chỉ cập nhật nếu có thay đổi)
            pet.PetName = request.PetName ?? pet.PetName;
            pet.Breed = request.Breed ?? pet.Breed;
            pet.Age = request.Age ?? pet.Age;
            pet.Gender = request.Gender ?? pet.Gender;
            pet.Weight = request.Weight ?? pet.Weight;
            pet.Notes = request.Notes ?? pet.Notes;

            try
            {
                await _context.SaveChangesAsync();

                // Trả về thông tin thú cưng đã cập nhật
                var updatedPet = new
                {
                    pet.PetId,
                    pet.PetName,
                    pet.Breed,
                    pet.Age,
                    pet.Gender,
                    pet.Weight,
                    pet.Notes
                };

                return Ok(new
                {
                    message = "Cập nhật hồ sơ thú cưng thành công!",
                    pet = updatedPet
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật dữ liệu!", error = ex.Message });
            }
        }

        // Tạo lịch hẹn
        [HttpPost("create-appointment")]
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

            if (request.ApDate < DateTime.Now)
            {
                return BadRequest(new { message = "Thời gian hẹn không được nhỏ hơn thời gian hiện tại!" });
            }

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
                    ApDate = request.ApDate.ToLocalTime(),
                    Status = "Pending",
                    Notes = request.Notes,
                    CreateAt = DateTime.Now
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
