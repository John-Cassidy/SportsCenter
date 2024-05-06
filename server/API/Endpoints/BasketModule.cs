using Core.Entities;
using Core.Repositories;

namespace API.Endpoints;

public static class BasketModule
{
    public static IEndpointRouteBuilder AddBasketEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/basket/{id}",
            async (IBasketRepository basketRepository, string id) =>
            {
                var basket = await basketRepository.GetBasketAsync(id);
                return Results.Ok(basket);
            })
            .WithName("GetBasket")
            .Produces<Basket?>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status404NotFound)
            .Produces<string>(StatusCodes.Status500InternalServerError);

        endpoints.MapPost("/basket",
            async (IBasketRepository basketRepository, Basket basket) =>
            {
                if (basket.UserName != null && basket.UserName != basket.Id)
                {
                    var existingBasket = await basketRepository.GetBasketAsync(basket.Id);
                    if (existingBasket != null)
                    {
                        await basketRepository.DeleteBasketAsync(existingBasket.Id);
                    }
                    basket.Id = basket.UserName;
                    basket.UserName = null;
                }
                var updatedBasket = await basketRepository.UpdateBasketAsync(basket);
                return Results.Ok(updatedBasket);
            })
            .WithName("UpdateBasket")
            .Produces<Basket>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status500InternalServerError);

        endpoints.MapDelete("/basket/{id}",
            async (IBasketRepository basketRepository, string id) =>
            {
                var result = await basketRepository.DeleteBasketAsync(id);
                return Results.Ok(result);
            })
            .WithName("DeleteBasket")
            .Produces<bool>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status400BadRequest)
            .Produces<string>(StatusCodes.Status500InternalServerError);

        return endpoints;
    }
}