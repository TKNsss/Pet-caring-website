using Pet_caring_website.Models;

namespace Pet_caring_website.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
