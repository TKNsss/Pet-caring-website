using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Pet_caring_website.Services;
using Pet_caring_website.Helpers;

namespace Pet_caring_website.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ImageService _imageService;

        public ServicesController(AppDbContext context, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // api/v1/services
        [HttpGet]
        public async Task<IActionResult> GetAllServices()
        {
            try
            {
                var services = await _context.Services
                    .Include(s => s.ServiceSlotCapacities)
                    .Include(s => s.ServicePricings)
                    .Select(s => new
                    {
                        s.ServiceId,
                        s.ServiceName,
                        s.ServiceType,
                        desc = s.Description,
                        s.RatingStars,
                        s.RatingCount,
                        s.IsActive,
                        s.ServiceImgUrl,
                        pricing = s.ServicePricings.Select(sp => new
                        {
                            sp.MinWeight,
                            sp.MaxWeight,
                            sp.Price,
                            sp.Duration
                        }),
                        MinDuration = FormatDuration(s.ServicePricings.Any() ? s.ServicePricings.Min(sp => sp.Duration) : (TimeSpan?)null),
                        MaxDuration = FormatDuration(s.ServicePricings.Any() ? s.ServicePricings.Max(sp => sp.Duration) : (TimeSpan?)null),
                        MinPrice = s.ServicePricings.Any() ? s.ServicePricings.Min(sp => sp.Price) : (decimal?)null,
                        MaxPrice = s.ServicePricings.Any() ? s.ServicePricings.Max(sp => sp.Price) : (decimal?)null,
                        SlotCapacities = s.ServiceSlotCapacities.Select(sc => new
                        {
                            sc.MaxBookings
                        })
                    })
                    .ToListAsync();

                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving services.", error = ex.Message });
            }
        }

        // GET api/<ServicesController1>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ServicesController1>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ServicesController1>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ServicesController1>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpPost("upload-service-image")]
        public async Task<IActionResult> UploadServiceImg([FromForm(Name = "img")] IFormFile img, [FromForm(Name = "service_id")] int service_id)
        {
            if (img == null || img.Length == 0)
            {
                return BadRequest(new { message = "No image file provided." });
            }

            if (service_id <= 0)
            {
                return BadRequest(new { message = "service_id is required!" });
            }

            try
            {
                if (!VerifyUserRole.TryGetUserInfo(User, out Guid userId, out string? role))
                {
                    return Unauthorized(new { message = "Bạn chưa đăng nhập" });
                }

                if (role != "admin")
                {
                    return Unauthorized(new { message = "You have no permission to upload service image" });
                }

                var result = await _imageService.UploadServiceImageAsync(img, userId.ToString(), service_id);
                if (result == null)
                {
                    return StatusCode(500, new { error = "Error uploading service image. Please try again later." });
                }           

                var service = await _context.Services.FindAsync((short)service_id);
                if (service == null)
                {
                    return NotFound(new { error = "Service not found." });
                }
                var serviceImgUrl = result.SecureUrl.ToString();

                service.ServiceImgUrl = serviceImgUrl;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Image uploaded successfully!", imageUrl = serviceImgUrl, service_id });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Upload failed due to a server error.", details = ex.Message });
            }
        }

        private static string? FormatDuration(TimeSpan? duration)
        {
            if (duration == null) return null;

            var d = duration.Value;
            var parts = new List<string>();

            if (d.Hours > 0) parts.Add($"{d.Hours} hr{(d.Hours > 1 ? "s" : "")}");
            if (d.Minutes > 0) parts.Add($"{d.Minutes} min{(d.Minutes > 1 ? "s" : "")}");

            return parts.Count > 0 ? string.Join(" ", parts) : "0 mins";
        }
    }
}
