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
            async (IProductRepository productRepository) =>
            {
                var products = await productRepository.GetProductsAsync();
                return Results.Ok(products);
            })
            .WithName("GetProducts")
            .Produces<IList<Product>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound);

        endpoints.MapGet("/products/{id}",
            async (IProductRepository productRepository, int id) =>
            {
                var product = await productRepository.GetProductByIdAsync(id);
                return Results.Ok(product);
            })
            .WithName("GetProductById")
            .Produces<Product>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound);

        endpoints.MapGet("/brands",
            async (IProductRepository productRepository) =>
            {
                var productBrands = await productRepository.GetProductBrandsAsync();
                return Results.Ok(productBrands);
            })
            .WithName("GetProductBrands")
            .Produces<IList<ProductBrand>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound);

        endpoints.MapGet("/types",
            async (IProductRepository productRepository) =>
            {
                var productTypes = await productRepository.GetProductTypesAsync();
                return Results.Ok(productTypes);
            })
            .WithName("GetProductTypes")
            .Produces<IList<ProductType>>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status404NotFound);

        return endpoints;
    }
}