using System.Text.Json.Serialization;

namespace Pet_caring_website.DTOs.Specie
{
    public class SpeciesDto
    {
        [JsonPropertyName("spc_id")]
        public short SpcId { get; set; }

        [JsonPropertyName("spc_name")]
        public string SpcName { get; set; } = null!;
    }
}
