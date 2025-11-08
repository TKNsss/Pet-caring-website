namespace Pet_caring_website.DTOs.Service
{
    public class UpdateServiceRequestDTO
    {
        public string? ServiceName { get; set; }
        public string? ServiceType { get; set; }
        public string? Description { get; set; }
        public decimal? RatingStars { get; set; }
        public int? RatingCount { get; set; }
        public bool? IsActive { get; set; }
        public IEnumerable<string>? Keywords { get; set; }
    }
}
