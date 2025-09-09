namespace Pet_caring_website.Configurations
{
    // this is strongly typed configuration class -> maps directly to a section in your appsettings.json, and then binding it in the Program.cs.
    // why use?
    // 1. Strongly typed: Provides compile-time checking and IntelliSense support in IDEs.
    // 2. Easy to use: You can access properties directly without needing to parse strings, can be injected
    // -> NO MORE Configuration["Jwt:Secret"]
    // -> var key = _jwtSettings.Secret; (good)

    public class CloudinarySettings
    {
        // Since the class has no constructor assigning a value, C# assumes it might be null.
        public string CloudName { get; set; } = string.Empty; // avoid null warnings and potential NullReferenceException
        public string ApiKey { get; set; } = string.Empty;
        public string ApiSecret { get; set; } = string.Empty;
    }
}
