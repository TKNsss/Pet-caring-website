namespace Pet_caring_website.Interfaces
{
    public interface IUserContextService
    {
        Guid? UserId { get; } // Extracted from JWT(or null if not logged in).
        string? Role { get; } //  Extracted from claims.
        bool IsAuthenticated { get; }
        void EnsureAuthenticated(); // Throws if user is not logged in
    }
}
