using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Pet_caring_website.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;
        private readonly IProblemDetailsService _problemDetailsService;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IProblemDetailsService problemDetailsService)
        {
            _logger = logger;
            _problemDetailsService = problemDetailsService;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext, 
            Exception exception, 
            CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "An error occurred while processing your request: {Message}", exception.Message);

            var response = httpContext.Response;

            var (statusCode, title, typeUri) = exception switch
            {
                UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized", "https://httpstatuses.com/401"),
                ArgumentException => (StatusCodes.Status400BadRequest, "Bad Request", "https://httpstatuses.com/400"),
                KeyNotFoundException => (StatusCodes.Status404NotFound, "Not Found", "https://httpstatuses.com/404"),
                _ => (StatusCodes.Status500InternalServerError, "Internal Server Error", "https://httpstatuses.com/500")
            };

            response.StatusCode = statusCode;

            var problem = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Type = typeUri,
                Detail = exception.Message,
                Instance = httpContext.Request.Path
            };

            problem.Extensions["exceptionType"] = exception.GetType().Name;

            return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
            {
                HttpContext = httpContext,
                Exception = exception,
                ProblemDetails =  problem,
            });
        }
    }
}
