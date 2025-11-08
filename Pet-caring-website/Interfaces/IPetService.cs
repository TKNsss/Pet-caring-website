using Pet_caring_website.DTOs.Pet;

namespace Pet_caring_website.Interfaces
{
    public interface IPetService
    {
        Task<IEnumerable<PetResponseDTO>> GetAllPetsByUserAsync();
        Task<PetResponseDTO> GetPetByIdAsync(int petId);
        Task<PetResponseDTO> CreatePetAsync(CreatePetRequestDTO request);
        Task<PetResponseDTO> UpdatePetAsync(int petId, UpdatePetRequestDTO request);
        Task<int> DeletePetAsync(int petId);
        Task<UploadPetImageResponseDTO> UploadPetImageAsync(IFormFile image, int petId);
    }
}
