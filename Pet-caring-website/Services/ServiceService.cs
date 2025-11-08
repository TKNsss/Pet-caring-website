using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Pet_caring_website.DTOs.Common;
using Pet_caring_website.DTOs.Service;
using Pet_caring_website.Interfaces;
using Pet_caring_website.Models.Services;

namespace Pet_caring_website.Services
{
    public class ServiceService : IServiceService
    {
        private readonly AppDbContext _context;
        private readonly IUserContextService _userContext;
        private readonly IImageService _imageService;
        private readonly ILogger<ServiceService> _logger;

        public ServiceService(
            AppDbContext context,
            IUserContextService userContext,
            IImageService imageService,
            ILogger<ServiceService> logger)
        {
            _context = context;
            _userContext = userContext;
            _imageService = imageService;
            _logger = logger;
        }

        public async Task<PagedResultDTO<ServiceCardDTO>> GetServiceCardsAsync(ServiceQueryParameters queryParameters)
        {
            queryParameters.Normalize();

            var servicesQuery = _context.Services
                .AsNoTracking()
                .Include(s => s.ServicePricings)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(queryParameters.Search))
            {
                var search = queryParameters.Search.Trim();
                servicesQuery = servicesQuery.Where(s =>
                    EF.Functions.ILike(s.ServiceName, $"%{search}%") ||
                    EF.Functions.ILike(s.ServiceType, $"%{search}%") ||
                    EF.Functions.ILike(s.Description, $"%{search}%"));
            }

            if (!string.IsNullOrWhiteSpace(queryParameters.Type))
            {
                var type = queryParameters.Type.Trim();
                servicesQuery = servicesQuery.Where(s =>
                    EF.Functions.ILike(s.ServiceType, $"%{type}%"));
            }

            if (queryParameters.IsActive.HasValue)
            {
                servicesQuery = servicesQuery.Where(s => s.IsActive == queryParameters.IsActive.Value);
            }

            var totalCount = await servicesQuery.CountAsync();

            servicesQuery = (queryParameters.SortBy?.ToLowerInvariant(), queryParameters.SortDescending) switch
            {
                ("price", true) => servicesQuery.OrderByDescending(s =>
                    s.ServicePricings.Select(sp => (decimal?)sp.Price).DefaultIfEmpty().Min()),
                ("price", false) => servicesQuery.OrderBy(s =>
                    s.ServicePricings.Select(sp => (decimal?)sp.Price).DefaultIfEmpty().Min()),
                ("rating", true) => servicesQuery.OrderByDescending(s => s.RatingStars ?? 0),
                ("rating", false) => servicesQuery.OrderBy(s => s.RatingStars ?? 0),
                _ => servicesQuery.OrderBy(s => s.ServiceName)
            };

            var rawItems = await servicesQuery
                .Skip((queryParameters.Page - 1) * queryParameters.PageSize)
                .Take(queryParameters.PageSize)
                .Select(s => new
                {
                    s.ServiceId,
                    s.ServiceName,
                    s.ServiceType,
                    s.Description,
                    s.RatingStars,
                    s.RatingCount,
                    s.IsActive,
                    s.ServiceImgUrl,
                    Pricings = s.ServicePricings.Select(sp => new
                    {
                        sp.Price,
                        sp.Duration
                    })
                })
                .ToListAsync();

            var cards = rawItems.Select(s =>
            {
                var pricingList = s.Pricings.ToList();
                var prices = pricingList.Select(p => (decimal?)p.Price).Where(p => p.HasValue).Cast<decimal>().ToList();
                var durations = pricingList
                    .Where(p => p.Duration.HasValue)
                    .Select(p => p.Duration!.Value)
                    .ToList();

                return new ServiceCardDTO
                {
                    ServiceId = s.ServiceId,
                    ServiceName = s.ServiceName,
                    ServiceType = s.ServiceType,
                    Description = s.Description,
                    RatingStars = s.RatingStars,
                    RatingCount = s.RatingCount,
                    IsActive = s.IsActive,
                    ServiceImgUrl = s.ServiceImgUrl,
                    MinPrice = prices.Count > 0 ? prices.Min() : null,
                    MaxPrice = prices.Count > 0 ? prices.Max() : null,
                    MinDuration = durations.Count > 0 ? FormatDuration(durations.Min()) : null,
                    MaxDuration = durations.Count > 0 ? FormatDuration(durations.Max()) : null
                };
            }).ToList();

            return new PagedResultDTO<ServiceCardDTO>(
                cards,
                totalCount,
                queryParameters.Page,
                queryParameters.PageSize);
        }

        public async Task<ServiceResponseDTO> GetServiceByIdAsync(short serviceId)
        {
            var service = await _context.Services
                .AsNoTracking()
                .Include(s => s.ServicePricings)
                .Include(s => s.ServiceSlotCapacities)
                .FirstOrDefaultAsync(s => s.ServiceId == serviceId)
                ?? throw new KeyNotFoundException("Service not found.");

            return MapToResponse(service);
        }

        public async Task<ServiceResponseDTO> CreateServiceAsync(CreateServiceRequestDTO request)
        {
            EnsureAdmin();

            var serviceName = request.ServiceName.Trim();
            var serviceType = request.ServiceType.Trim();

            var exists = await _context.Services
                .AnyAsync(s => EF.Functions.ILike(s.ServiceName, serviceName));

            if (exists)
                throw new ArgumentException("Service name already exists.");

            var service = new Service
            {
                ServiceName = serviceName,
                ServiceType = serviceType,
                Description = request.Description.Trim(),
                RatingStars = request.RatingStars,
                RatingCount = request.RatingCount,
                IsActive = request.IsActive ?? true,
                Keywords = NormalizeKeywords(request.Keywords),
                UpdateAt = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return await GetServiceByIdAsync(service.ServiceId);
        }

        public async Task<ServiceResponseDTO> UpdateServiceAsync(short serviceId, UpdateServiceRequestDTO request)
        {
            EnsureAdmin();

            var service = await _context.Services
                .Include(s => s.ServicePricings)
                .Include(s => s.ServiceSlotCapacities)
                .FirstOrDefaultAsync(s => s.ServiceId == serviceId)
                ?? throw new KeyNotFoundException("Service not found.");

            if (!string.IsNullOrWhiteSpace(request.ServiceName))
            {
                var newName = request.ServiceName.Trim();
                var exists = await _context.Services
                    .AnyAsync(s => s.ServiceId != serviceId && EF.Functions.ILike(s.ServiceName, newName));

                if (exists)
                    throw new ArgumentException("Another service with this name already exists.");

                service.ServiceName = newName;
            }

            if (!string.IsNullOrWhiteSpace(request.ServiceType))
                service.ServiceType = request.ServiceType.Trim();

            if (!string.IsNullOrWhiteSpace(request.Description))
                service.Description = request.Description.Trim();

            if (request.RatingStars.HasValue)
                service.RatingStars = request.RatingStars.Value;

            if (request.RatingCount.HasValue)
                service.RatingCount = request.RatingCount.Value;

            if (request.IsActive.HasValue)
                service.IsActive = request.IsActive.Value;

            if (request.Keywords != null)
                service.Keywords = NormalizeKeywords(request.Keywords);

            service.UpdateAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponse(service);
        }

        public async Task<short> DeleteServiceAsync(short serviceId)
        {
            EnsureAdmin();

            var service = await _context.Services
                .Include(s => s.ServiceDetails)
                .Include(s => s.ServicePricings)
                .Include(s => s.ServiceSlotCapacities)
                .FirstOrDefaultAsync(s => s.ServiceId == serviceId)
                ?? throw new KeyNotFoundException("Service not found.");

            _context.ServiceDetails.RemoveRange(service.ServiceDetails);
            _context.ServicePricings.RemoveRange(service.ServicePricings);
            _context.ServiceSlotCapacities.RemoveRange(service.ServiceSlotCapacities);
            _context.Services.Remove(service);

            await _context.SaveChangesAsync();
            return serviceId;
        }

        public async Task<UploadServiceImageResponseDTO> UploadServiceImageAsync(IFormFile image, short serviceId)
        {
            EnsureAdmin();

            if (image == null || image.Length == 0)
                throw new ArgumentException("No image file provided.");

            var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceId == serviceId)
                ?? throw new KeyNotFoundException("Service not found.");

            var userId = _userContext.UserId?.ToString()
                ?? throw new InvalidOperationException("User context is missing identifier.");

            var uploadResult = await _imageService.UploadServiceImageAsync(image, userId, serviceId);

            service.ServiceImgUrl = uploadResult.SecureUrl?.ToString();
            service.UpdateAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new UploadServiceImageResponseDTO
            {
                ServiceId = service.ServiceId,
                ServiceImgUrl = service.ServiceImgUrl ?? string.Empty,
                PublicId = uploadResult.PublicId
            };
        }

        public async Task<IEnumerable<ServiceResponseDTO>> GetAllServicesAsync()
        {
            var services = await _context.Services
                .AsNoTracking()
                .Include(s => s.ServicePricings)
                .Include(s => s.ServiceSlotCapacities)
                .OrderBy(s => s.ServiceName)
                .ToListAsync();

            return services.Select(MapToResponse);
        }

        private ServiceResponseDTO MapToResponse(Service service)
        {
            var pricingDtos = service.ServicePricings
                .OrderBy(p => p.MinWeight)
                .Select(p => new ServicePricingDTO
                {
                    PricingId = p.PricingId,
                    MinWeight = p.MinWeight,
                    MaxWeight = p.MaxWeight,
                    Price = p.Price,
                    DurationInMinutes = p.Duration.HasValue ? (int?)Math.Round(p.Duration.Value.TotalMinutes) : null,
                    DurationDisplay = FormatDuration(p.Duration)
                })
                .ToList();

            var slotDtos = service.ServiceSlotCapacities
                .OrderBy(sc => sc.SscId)
                .Select(sc => new ServiceSlotCapacityDTO
                {
                    SscId = sc.SscId,
                    MaxBookings = sc.MaxBookings
                })
                .ToList();

            var dto = new ServiceResponseDTO
            {
                ServiceId = service.ServiceId,
                ServiceName = service.ServiceName,
                ServiceType = service.ServiceType,
                Description = service.Description,
                RatingStars = service.RatingStars,
                RatingCount = service.RatingCount,
                IsActive = service.IsActive,
                ServiceImgUrl = service.ServiceImgUrl,
                Keywords = service.Keywords,
                Pricing = pricingDtos,
                SlotCapacities = slotDtos
            };

            if (pricingDtos.Count > 0)
            {
                dto.MinPrice = pricingDtos.Min(p => p.Price);
                dto.MaxPrice = pricingDtos.Max(p => p.Price);

                var durations = service.ServicePricings
                    .Where(p => p.Duration.HasValue)
                    .Select(p => p.Duration!.Value)
                    .ToList();

                if (durations.Count > 0)
                {
                    dto.MinDuration = FormatDuration(durations.Min());
                    dto.MaxDuration = FormatDuration(durations.Max());
                }
            }

            return dto;
        }

        private static string[]? NormalizeKeywords(IEnumerable<string>? keywords)
        {
            if (keywords == null)
                return null;

            var normalized = keywords
                .Where(k => !string.IsNullOrWhiteSpace(k))
                .Select(k => k.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();

            return normalized.Length > 0 ? normalized : null;
        }

        private void EnsureAdmin()
        {
            _userContext.EnsureAuthenticated();
            if (!string.Equals(_userContext.Role, "admin", StringComparison.OrdinalIgnoreCase))
                throw new UnauthorizedAccessException("You do not have permission to perform this action.");
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
