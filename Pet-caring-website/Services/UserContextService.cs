using Pet_caring_website.Interfaces;
using System.Security.Claims;

namespace Pet_caring_website.Services
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor; // access the current HttpContext.

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User; // Reads JWT claims

        public Guid? UserId
        {
            get
            {
                var claim = User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return Guid.TryParse(claim, out var id) ? id : (Guid?)null;
            }
        }

        public string? Role => User?.FindFirstValue(ClaimTypes.Role);

        public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

        public void EnsureAuthenticated()
        {
            if (!IsAuthenticated || UserId == null)
                throw new UnauthorizedAccessException("You must be logged in to perform this action.");
        }
    }
}
