using System.Text.Json.Serialization;

namespace Pet_caring_website.DTOs.Auth;

public class GitHubEmail
{
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("primary")]
    public bool Primary { get; set; }

    [JsonPropertyName("verified")]
    public bool Verified { get; set; }
}
