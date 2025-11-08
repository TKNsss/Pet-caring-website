namespace Pet_caring_website.DTOs.Service
{
    public class ServiceResponseDTO
    {
        public short ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal? RatingStars { get; set; }
        public int? RatingCount { get; set; }
        public bool IsActive { get; set; }
        public string? ServiceImgUrl { get; set; }
        public string[]? Keywords { get; set; }
        public IEnumerable<ServicePricingDTO> Pricing { get; set; } = new List<ServicePricingDTO>();
        public string? MinDuration { get; set; }
        public string? MaxDuration { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public IEnumerable<ServiceSlotCapacityDTO> SlotCapacities { get; set; } = new List<ServiceSlotCapacityDTO>();
    }
}
