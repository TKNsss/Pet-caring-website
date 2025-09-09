using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Pet_caring_website.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AppointmentHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            // Nếu user có role "vet", thêm vào group "vets"
            if (Context.User.IsInRole("vet"))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "vets");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (Context.User.IsInRole("vet"))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, "vets");
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
