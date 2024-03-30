using API.DTOs;
using AutoMapper;
using Core.Entities;

namespace API.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDTO>()          
            .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name))
            .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name));
    }
}
