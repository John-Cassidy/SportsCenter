using Core.Entities;
using Core.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Endpoints;

public static class ProductsModule
{
    public static IEndpointRouteBuilder AddProductsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/products",
            async (IRepository<Product> productRepository) =>
            {
                var products = await productRepository.GetListAsync(p => p.ProductBrand, p => p.ProductType);
                return Results.Ok(products);
            })
            .WithName("GetProducts")
            .Produces<IList<Product>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound);

        endpoints.MapGet("/products/{id}",
            async (IRepository<Product> productRepository, int id) =>
            {
                var product = await productRepository.GetByIdAsync(id, p => p.ProductBrand, p => p.ProductType);
                return Results.Ok(product);
            })
            .WithName("GetProductById")
            .Produces<Product>(StatusCodes.Status200OK)
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