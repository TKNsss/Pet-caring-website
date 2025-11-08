namespace Pet_caring_website.DTOs.Service
{
    public class ServicePricingDTO
    {
        public int PricingId { get; set; }
        public decimal MinWeight { get; set; }
        public decimal MaxWeight { get; set; }
        public decimal Price { get; set; }
        public int? DurationInMinutes { get; set; }
        public string? DurationDisplay { get; set; }
    }
}
