using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Pet_caring_website.Hubs;
using Pet_caring_website.Models;

namespace Pet_caring_website.Services
{
    public class AutoAssignService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHubContext<AppointmentHub> _hub;

        public AutoAssignService(IServiceScopeFactory scopeFactory, IHubContext<AppointmentHub> hub)
        {
            _scopeFactory = scopeFactory;
            _hub = hub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // 1. Tìm các appointment >30 phút, status = Confirmed và chưa có vet nhận
                var cutoff = DateTime.UtcNow.AddMinutes(-30);
                var toAssign = await db.Appointments
                    .Where(a => a.Status == "User-Confirmed"
                             && a.CreateAt <= cutoff
                             && a.VetId == null)
                    .ToListAsync(stoppingToken);

                // 2. Lấy danh sách tất cả vets
                var vets = await db.Users
                    .Where(u => u.Role == "vet")
                    .ToListAsync(stoppingToken);

                foreach (var appt in toAssign)
                {
                    // 3. Với mỗi vet, đếm số InProgress và kiểm tra xung giờ
                    var candidates = new List<(Guid VetId, int Count)>();
                    foreach (var vet in vets)
                    {
                        // đếm số lịch đang làm của vet
                        var inProg = await db.Appointments
                            .Where(a => a.VetId == vet.UserId && a.Status == "InProgress")
                            .ToListAsync(stoppingToken);

                        // kiểm tra conflict ±1h
                        bool conflict = inProg.Any(a =>
                            Math.Abs((a.ApDate - appt.ApDate).TotalHours) < 1);

                        if (!conflict)
                            candidates.Add((vet.UserId, inProg.Count));
                    }

                    // 4. Chọn vet có ít Count nhất
                    var best = candidates.OrderBy(c => c.Count).FirstOrDefault();
                    if (best.VetId == Guid.Empty)
                    {
                        // chưa tìm được ai phù hợp
                        continue;
                    }

                    // 5. Gán vet và chuyển status -> InProgress
                    appt.VetId = best.VetId;
                    appt.Status = "InProgress";
                    db.Appointments.Update(appt);
                    await db.SaveChangesAsync(stoppingToken);

                    // 6. Real‑time notify vet group
                    await _hub.Clients.Group("vets")
                        .SendAsync("AppointmentAutoAssigned", new
                        {
                            AppointmentId = appt.ApId,
                            VetId = best.VetId
                        }, stoppingToken);
                }

                // 7. Lặp lại mỗi 5 phút
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
