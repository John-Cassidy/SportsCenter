namespace API.Endpoints;

public static class ProductsModule
{


    public static IEndpointRouteBuilder AddProductsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/products",
            async () =>
            {
                var _Products = GetFakeProducts();
                return Results.Ok(_Products);
            });

        endpoints.MapGet("/products/{id}",
            async (string id) =>
            {
                var _Products = GetFakeProducts();
                var _Product = _Products.FirstOrDefault(x => x.Id == id);
                return _Product != null ? Results.Ok(_Product) : Results.NotFound();
            });

        return endpoints;
    }

    public static IEnumerable<Product> GetFakeProducts()
    {
        return new List<Product>
        {
            new Product("1", "Product 1", "Description 1", 10.0, "url1", 1, 1),
            new Product("2", "Product 2", "Description 2", 20.0, "url2", 2, 2),
            new Product("3", "Product 3", "Description 3", 30.0, "url3", 3, 3),
            new Product("4", "Product 4", "Description 4", 40.0, "url4", 4, 4),
            new Product("5", "Product 5", "Description 5", 50.0, "url5", 5, 5)
        };
    }
}

// create Product class with properties Id, Name, Description, Price, PictureUrl, ProductTypeId, ProductBrandId
public record Product(string Id, string Name, string Description, double Price, string PictureUrl, int ProductTypeId, int ProductBrandId);