using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pet_caring_website.DTOs.Service;
using Pet_caring_website.Interfaces;

namespace Pet_caring_website.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllServices([FromQuery] ServiceQueryParameters query)
        {
            var pagedResult = await _serviceService.GetServiceCardsAsync(query);
            return Ok(new
            {
                message = "Services retrieved successfully",
                data = pagedResult.Items,
                meta = new
                {
                    totalCount = pagedResult.TotalCount,
                    page = pagedResult.Page,
                    pageSize = pagedResult.PageSize,
                    totalPages = pagedResult.TotalPages
                }
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceById(short id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            return Ok(new
            {
                message = "Service retrieved successfully",
                data = service
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateService([FromBody] CreateServiceRequestDTO request)
        {
            var created = await _serviceService.CreateServiceAsync(request);
            return CreatedAtAction(
                nameof(GetServiceById),
                new { id = created.ServiceId },
                new
                {
                    message = "Service created successfully",
                    data = created
                });
        }

        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateService(short id, [FromBody] UpdateServiceRequestDTO request)
        {
            var updated = await _serviceService.UpdateServiceAsync(id, request);
            return Ok(new
            {
                message = "Service updated successfully",
                data = updated
            });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteService(short id)
        {
            var deletedId = await _serviceService.DeleteServiceAsync(id);
            return Ok(new
            {
                message = "Service deleted successfully",
                data = deletedId
            });
        }

        [HttpPost("upload-service-image")]
        [Authorize]
        public async Task<IActionResult> UploadServiceImg(
            [FromForm(Name = "img")] IFormFile img,
            [FromForm(Name = "service_id")] short serviceId)
        {
            var response = await _serviceService.UploadServiceImageAsync(img, serviceId);
            return Ok(new
            {
                message = "Image uploaded successfully!",
                data = response
            });
        }
    }
}
