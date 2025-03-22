using Microsoft.AspNetCore.Mvc;

namespace Pet_caring_website.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/dist/index.html");

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Frontend build not found. Run 'npm run build' in ClientApp.");
            }

            return PhysicalFile(filePath, "text/html");
        }

        public IActionResult Privacy() => RedirectToAction("Index");

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() => RedirectToAction("Index");
    }
}
