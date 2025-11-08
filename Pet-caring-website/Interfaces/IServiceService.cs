using Pet_caring_website.DTOs.Common;
using Pet_caring_website.DTOs.Service;

namespace Pet_caring_website.Interfaces
{
    public interface IServiceService
    {
        Task<PagedResultDTO<ServiceCardDTO>> GetServiceCardsAsync(ServiceQueryParameters queryParameters);
        Task<IEnumerable<ServiceResponseDTO>> GetAllServicesAsync();
        Task<ServiceResponseDTO> GetServiceByIdAsync(short serviceId);
        Task<ServiceResponseDTO> CreateServiceAsync(CreateServiceRequestDTO request);
        Task<ServiceResponseDTO> UpdateServiceAsync(short serviceId, UpdateServiceRequestDTO request);
        Task<short> DeleteServiceAsync(short serviceId);
        Task<UploadServiceImageResponseDTO> UploadServiceImageAsync(IFormFile image, short serviceId);
    }
}
