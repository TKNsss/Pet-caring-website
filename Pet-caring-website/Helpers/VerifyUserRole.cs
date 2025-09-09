using System.Security.Claims;

namespace Pet_caring_website.Helpers
{
    public static class VerifyUserRole
    {
        // Kiểm tra đăng nhập và lấy userId từ claim
        // method stays static allows it to be called without instantiating the class
        public static bool TryGetUserInfo(ClaimsPrincipal user, out Guid userId, out string? role)
        {
            userId = Guid.Empty;
            role = null;

            if (user == null)
                return false;

            bool hasAny = false;

            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out Guid parsedUserId))
            {
                userId = parsedUserId;
                hasAny = true;
            }

            var roleClaim = user.FindFirstValue(ClaimTypes.Role);
            if (!string.IsNullOrEmpty(roleClaim))
            {
                role = roleClaim;
                hasAny = true;
            }

            return hasAny;
        }
    }
}
