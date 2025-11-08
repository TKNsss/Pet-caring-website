using AutoMapper;
using Pet_caring_website.DTOs.Auth;
using Pet_caring_website.DTOs.User;
using Pet_caring_website.DTOs.Pet;
using Pet_caring_website.Models;

namespace Pet_caring_website.MappingProfiles
{
    public class AutoMapperProfile : Profile
    {
        // Entity → DTO (Response): Expose only what the client should see
        // DTO → Entity (Create/Update): Accept only what the client is 'allowed to change'
        // You only write .ForMember(...) rules when there’s extra logic.
        // Everything else is handled by AutoMapper’s convention-based mapping automatically.
        public AutoMapperProfile()
        {
            // AutoMapper takes all properties from RegisterRequestDTO that match User (by name & type).
            // User
            CreateMap<RegisterRequestDTO, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore()) // We'll hash manually
                .ForMember(dest => dest.Role, opt => opt.Ignore())     // Default is set in code
                .ForMember(dest => dest.UserId, opt => opt.Ignore());  // Set manually

            CreateMap<User, UserInfoDTO>();
            CreateMap<User, UserDetailDTO>();

            // Pet
            CreateMap<Pet, PetResponseDTO>()
                .ForMember(dest => dest.SpcName, opt => opt.MapFrom(src => src.Species != null ? src.Species.SpcName : null));

            CreateMap<CreatePetRequestDTO, Pet>()
                .ForMember(dest => dest.PetName, opt => opt.MapFrom(src => src.PetName.Trim()))
                .ForMember(dest => dest.Breed, opt => opt.MapFrom(src => src.Breed != null ? src.Breed.Trim() : null))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes != null ? src.Notes.Trim() : null))
                .ForMember(dest => dest.AvatarUrl, opt => opt.Ignore())
                .ForMember(dest => dest.AdoptDate, opt => opt.MapFrom(src =>
                    src.AdoptDate.HasValue
                        ? DateOnly.FromDateTime(src.AdoptDate.Value)
                        : (DateOnly?)null
                ));

            CreateMap<UpdatePetRequestDTO, Pet>()
                // (3) ignore the reference 
                .ForMember(dest => dest.PetOwners, opt => opt.Ignore())
                .ForMember(dest => dest.AdoptDate, opt => opt.MapFrom(src =>
                    src.AdoptDate.HasValue
                        ? DateOnly.FromDateTime(src.AdoptDate.Value)
                        : (DateOnly?)null
                ))
                // (2) ensure we only trim/assign when something was actually provided.
                .AfterMap((src, dest) =>
                {
                    if (!string.IsNullOrWhiteSpace(src.PetName))
                        dest.PetName = src.PetName.Trim();

                    if (!string.IsNullOrWhiteSpace(src.Breed))
                        dest.Breed = src.Breed.Trim();

                    if (!string.IsNullOrWhiteSpace(src.Notes))
                        dest.Notes = src.Notes.Trim();
                })
                // skip mapping nulls and whitespace-only strings entirely -> won't update these fields (1)
                .ForAllMembers(opt =>
                    opt.Condition((src, dest, srcMember) =>
                        srcMember != null &&
                        (!(srcMember is string str) || !string.IsNullOrWhiteSpace(str))
                    )
                );
        }
    }
}