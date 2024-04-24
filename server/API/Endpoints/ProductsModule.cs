using API.DTOs;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Repositories;
using Infrastructure.Data;
using Infrastructure.Specifications;
using Microsoft.EntityFrameworkCore;

namespace API.Endpoints;

public static class ProductsModule
{
    public static IEndpointRouteBuilder AddProductsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/products",
            async (HttpContext context, IMapper mapper, IRepository<Product> productRepository, [AsParameters] ProductParams productParams) =>
            {
                // if (!context.User.Identity?.IsAuthenticated ?? false)
                // {
                //     return Results.Unauthorized();
                // }

                // Create a specification
                var sort = productParams.Sort ?? string.Empty;
                var productTypeId = productParams.ProductTypeId;
                var productBrandId = productParams.ProductBrandId;
                var skip = productParams.Skip ?? 0;
                var take = productParams.Take ?? 10;
                var search = productParams.Search;

                var countSpec = new ProductCountSpecification(productTypeId, productBrandId, search);
                var totalCount = await productRepository.CountAsync(countSpec);
                if (totalCount == 0)
                {
                    return Results.Ok(new Pagination<ProductDTO>(skip, take, 0, new List<ProductDTO>()));
                }

                var spec = new ProductWithTypesAndBrandSpecification(sort, productTypeId, productBrandId, skip, take, search);
                var products = await productRepository.GetListAsync(spec);
                var productsDto = mapper.Map<IList<Product>, IList<ProductDTO>>(products);
                var pagination = new Pagination<ProductDTO>(skip, take, totalCount, productsDto.ToList());
                return Results.Ok(pagination);
            })
            .WithName("GetProducts")
            .Produces<Pagination<ProductDTO>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound)
            // .Produces(StatusCodes.Status401Unauthorized)
            .Produces<string>(StatusCodes.Status500InternalServerError);

        endpoints.MapGet("/products/{id}",
            async (IMapper mapper, IRepository<Product> productRepository, int id) =>
            {
                // Create a specification
                var spec = new ProductWithTypesAndBrandSpecification(id);

                // Use the specification with the repository to get filtered and included results
                var product = await productRepository.GetByIdAsync(spec);
                if (product == null)
                {
                    return Results.NotFound($"Product with id {id} not found.");
                }
                var productDto = mapper.Map<Product, ProductDTO>(product);
                return Results.Ok(productDto);
            })
            .WithName("GetProductById")
            .Produces<ProductDTO>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound)
            .Produces<string>(StatusCodes.Status500InternalServerError);

        endpoints.MapGet("/products/brands",
            async (IRepository<ProductBrand> productBrandRepository) =>
            {
                var productBrands = await productBrandRepository.GetProductBrandsAsync();
                return Results.Ok(productBrands);
            })
            .WithName("GetProductBrands")
            .Produces<IList<ProductBrand>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound)
            .Produces<string>(StatusCodes.Status500InternalServerError);

        endpoints.MapGet("/products/types",
            async (IRepository<ProductType> productTypeRepository) =>
            {
                var productTypes = await productTypeRepository.GetProductTypesAsync();
                return Results.Ok(productTypes);
            })
            .WithName("GetProductTypes")
            .Produces<IList<ProductType>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound)
            .Produces<string>(StatusCodes.Status500InternalServerError);

        return endpoints;
    }
}