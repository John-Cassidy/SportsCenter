using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Endpoints;

public static class ProductsModule
{

    public static IEndpointRouteBuilder AddProductsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/products",
            async (SportsCenterContext context) =>
            {
                var _Products = await context.Products.ToListAsync();
                return Results.Ok(_Products);
            });

        endpoints.MapGet("/products/{id}",
            async (SportsCenterContext context, int id) =>
            {
                var _Product = await context.Products.FirstOrDefaultAsync(x => x.Id == id);
                return _Product != null ? Results.Ok(_Product) : Results.NotFound();
            });

        return endpoints;
    }
}