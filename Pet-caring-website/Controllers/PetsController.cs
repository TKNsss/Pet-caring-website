using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pet_caring_website.Data;
using Pet_caring_website.DTOs.Pet;
using Pet_caring_website.Interfaces;

namespace Pet_caring_website.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PetsController : ControllerBase
    {
        private readonly IPetService _petService;

        public PetsController(AppDbContext context, IPetService petService)
        {   
            _petService = petService;
        }

        // GET: api/v1/pets (get all pets)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetALlPets()
        {
            var pets = await _petService.GetAllPetsByUserAsync();

            return Ok(new
            {
                message = "Pets retrieved successfully",
                data = pets
            });
        }

        // GET: api/v1/pets/{id}
        [HttpGet("{id}:int")]
        [Authorize]
        public async Task<IActionResult> GetPetById(int id)
        {
            var pet = await _petService.GetPetByIdAsync(id);

            return Ok(new
            {
                message = "Pet retrieved successfully",
                data = pet
            });
        }

        // POST: api/v1/pets
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePet([FromForm] CreatePetRequestDTO request)
        {
            var createdPet = await _petService.CreatePetAsync(request);

            return CreatedAtAction(
                nameof(GetPetById),  // Method name (call this service)
                new { id = createdPet.PetId }, // Route values for URL generation
                new
                {
                    message = "Pet created successfully",
                    data = createdPet
                } // Response body
            );
        }

        // PATCH api/v1/pets/5
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePet(int id, [FromBody] UpdatePetRequestDTO request)
        {
            var updatedPet = await _petService.UpdatePetAsync(id, request);

            return Ok(new
            {
                message = "Pet updated successfully",
                data = updatedPet
            });
        }

        // DELETE api/v1/pets/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePet(int id)
        {
            var petId = await _petService.DeletePetAsync(id);

            return Ok(new 
            { 
                message = "Pet deleted successfully", 
                data = petId
            });
        }

        [HttpPost("upload-pet-image")]
        [Authorize]
        public async Task<IActionResult> UploadPetImage([FromForm(Name = "img")] IFormFile image, [FromForm(Name = "petId")] int petId)
        {
            var response = await _petService.UploadPetImageAsync(image, petId);

            return Ok(new
            {
                message = "Pet image uploaded successfully.",
                data = response
            });
        }
    }
}
