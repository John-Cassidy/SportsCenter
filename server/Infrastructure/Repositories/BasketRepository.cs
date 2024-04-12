using System.Text;
using System.Text.Json;
using Core.Entities;
using Core.Repositories;
using Microsoft.Extensions.Caching.Distributed;

namespace Infrastructure.Repositories;

public class BasketRepository : IBasketRepository
{
    private readonly IDistributedCache _redisCache;

    public BasketRepository(IDistributedCache redisCache)
    {
        _redisCache = redisCache ?? throw new ArgumentNullException(nameof(redisCache));
    }

    public async Task<Basket?> GetBasketAsync(string id)
    {
        var redisKey = GetRedisKey(id);
        var basket = await _redisCache.GetStringAsync(redisKey);
        return basket is null ? null : JsonSerializer.Deserialize<Basket>(basket);
    }

    public async Task<Basket> UpdateBasketAsync(Basket basket)
    {
        await _redisCache.SetStringAsync(GetRedisKey(basket.Id), JsonSerializer.Serialize(basket));
        return basket;
    }

    public async Task<bool> DeleteBasketAsync(string id)
    {
        var redisKey = GetRedisKey(id);
        await _redisCache.RemoveAsync(redisKey);
        return true;
    }

    private static string GetRedisKey(string basketId) => $"Basket:{basketId}";
}
