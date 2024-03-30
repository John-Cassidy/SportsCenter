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
            async (IMapper mapper, IRepository<Product> productRepository, [AsParameters] ProductParams productParams) =>
            {
                // Create a specification
                var sort = productParams.Sort ?? string.Empty;
                var spec = new ProductWithTypesAndBrandSpecification(sort);
                IList<Product>? products = null;

                try
                {
                    products = await productRepository.GetListAsync(spec);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    // Handle the exception here
                    // Log the error, return an error response, etc.
                }
                var productsDto = mapper.Map<IList<Product>, IList<ProductDTO>>(products);
                return Results.Ok(productsDto);
            })
            .WithName("GetProducts")
            .Produces<IList<ProductDTO>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound);

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
            .Produces<string>(StatusCodes.Status404NotFound);

        endpoints.MapGet("/brands",
            async (IRepository<ProductBrand> productBrandRepository) =>
            {
                var productBrands = await productBrandRepository.GetProductBrandsAsync();
                return Results.Ok(productBrands);
            })
            .WithName("GetProductBrands")
            .Produces<IList<ProductBrand>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound);

        endpoints.MapGet("/types",
            async (IRepository<ProductType> productTypeRepository) =>
            {
                var productTypes = await productTypeRepository.GetProductTypesAsync();
                return Results.Ok(productTypes);
            })
            .WithName("GetProductTypes")
            .Produces<IList<ProductType>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound);

        return endpoints;
    }
}