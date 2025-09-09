using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Pet_caring_website.Configurations;
using Pet_caring_website.Interfaces;
using Pet_caring_website.Models;

namespace Pet_caring_website.Services
{
    public class JwtService : IJwtService
    {
        private readonly JwtSettings jwtSettings;
        private readonly ILogger<JwtService> _logger;

        public JwtService(IOptions<JwtSettings> options, ILogger<JwtService> logger)
        {
            jwtSettings = options.Value;
            _logger = logger;
        }

        public string GenerateToken(User user)
        {
            var jwtKey = jwtSettings.SecretKey;
            var issuer = jwtSettings.Issuer;
            var audience = jwtSettings.Audience;
            var expiryInHours = jwtSettings.ExpiryInHours;

            if (string.IsNullOrWhiteSpace(jwtKey) ||
                string.IsNullOrWhiteSpace(issuer) ||
                string.IsNullOrWhiteSpace(audience))
            {
                _logger.LogError(
                    "JWT configuration is missing. Key: {Key}, Issuer: {Issuer}, Audience: {Audience}",
                    string.IsNullOrEmpty(jwtKey) ? "NULL" : "OK",
                    string.IsNullOrEmpty(issuer) ? "NULL" : "OK",
                    string.IsNullOrEmpty(audience) ? "NULL" : "OK"
                );
                throw new InvalidOperationException("JWT configuration values are missing or invalid.");
            }

            _logger.LogInformation(
                "Generating JWT for UserId: {UserId}, Email: {Email}, Role: {Role}",
                user.UserId, user.Email ?? "N/A", user.Role ?? "N/A"
            );

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? string.Empty)
            };

            if (!string.IsNullOrEmpty(user.Email))
            {
                claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiryInHours),
                signingCredentials: credentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            _logger.LogInformation("JWT successfully generated for UserId: {UserId}", user.UserId);

            return tokenString;
        }
    }
}
