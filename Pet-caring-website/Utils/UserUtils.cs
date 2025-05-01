using System.Security.Claims;

namespace Pet_caring_website.Utils
{
    public static class UserUtils
    {
        // Kiểm tra đăng nhập và lấy userId từ claim
        public static bool TryGetUserId(ClaimsPrincipal user, out Guid userId)
        {
            userId = Guid.Empty;
            var userIdClaim = user?.FindFirstValue(ClaimTypes.NameIdentifier);
            return !string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out userId);
        }
    }
}
