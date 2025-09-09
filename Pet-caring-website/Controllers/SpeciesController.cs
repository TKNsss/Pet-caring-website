using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pet_caring_website.Data;
using Pet_caring_website.Models;
using Pet_caring_website.DTOs.Specie;

namespace Pet_caring_website.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class SpeciesController : ControllerBase
    {
        private readonly AppDbContext _context;
        
        public SpeciesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/species - retrieves all records from the Species table.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpeciesDto>>> GetSpecies()
        {
            try
            {
                var species = await _context.Species
                    .Select(s => new SpeciesDto
                    {
                        SpcId = s.SpcId,
                        SpcName = s.SpcName
                    })
                    .ToListAsync();

                return Ok(species);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }          
        }

        // GET: api/v1/species/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Species>> GetSpecies(short id)
        {
            var species = await _context.Species.FindAsync(id);

            if (species == null)
            {
                return NotFound();
            }

            return species;
        }

        [HttpPost]
        public async Task<ActionResult<Species>> PostSpecies([FromBody] Species species)
        {
            // Remove ID if client mistakenly sets it
            species.SpcId = 0;

            _context.Species.Add(species);
            await _context.SaveChangesAsync();

            // return status code 201 - created
            // (1) The location of the new resource can be accessed by calling the GetSpecies action.
            // (2) This builds the route values (query parameters) used to generate the URL to the
            // GetSpecies endpoint => becomes the Location header in the response.
            // 201 Created -> Location: https://your-domain/api/v1/Species/5 -> species object (body JSON)

            // follows RESTful conventions.
            // lets the client know where to find the new resource (via the Location header).
            return CreatedAtAction(nameof(GetSpecies), new { id = species.SpcId }, species);
        }

        // PUT: api/v1/Species/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpecies(short id, [FromBody] Species species)
        {
            if (id != species.SpcId)
            {
                return BadRequest();
            }

            _context.Entry(species).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Species.Any(e => e.SpcId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // Returns 204 No Content on success.
            return NoContent();
        }

        // DELETE: api/v1/Species/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecies(short id)
        {
            var species = await _context.Species.FindAsync(id);
            if (species == null)
            {
                return NotFound();
            }

            _context.Species.Remove(species);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
