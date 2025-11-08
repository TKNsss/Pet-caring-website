namespace Pet_caring_website.DTOs.Service
{
    public class ServiceQueryParameters
    {
        private const int MaxPageSize = 50;

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 6;
        public string? Search { get; set; }
        public string? Type { get; set; }
        public bool? IsActive { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; }

        public void Normalize()
        {
            if (Page < 1)
                Page = 1;

            if (PageSize < 1)
                PageSize = 1;

            if (PageSize > MaxPageSize)
                PageSize = MaxPageSize;
        }
    }
}
