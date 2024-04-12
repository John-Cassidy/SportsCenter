using Core.Entities;

namespace Core.Repositories;

public interface IBasketRepository
{
    Task<Basket?> GetBasketAsync(string basketId);
    Task<Basket> UpdateBasketAsync(Basket basket);
    Task<bool> DeleteBasketAsync(string basketId);
}
