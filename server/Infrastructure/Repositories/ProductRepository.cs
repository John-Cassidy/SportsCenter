using Core.Entities;
using Core.Repositories;
using Infrastructure.Data;
using Core.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using System.Text;

namespace Infrastructure.Repositories;

[Obsolete("This class is obsolete. Use Repository<T> instead.", true)]
public class ProductRepository : IProductRepository
{
    // add SportsCenterContext and inject it in the constructor
    private readonly SportsCenterContext _context;
    private readonly IDistributedCache _redisCache;

    public ProductRepository(SportsCenterContext context, IDistributedCache redisCache)
    {
        _context = context;
        _redisCache = redisCache;
    }


    public async Task<Product> GetByIdAsync(int id)
    {
        var redisKey = GetRedisProductKey(id.ToString());
        var productCache = await _redisCache.GetAsync(redisKey);

        if (productCache != null)
        {
            // Deserialize the byte array to a Product object
            var product = JsonSerializer.Deserialize<Product>(Encoding.UTF8.GetString(productCache));
            if (product != null) return product;
        }

        // If the product is not in the cache, retrieve it from the database
        var productFromDb = await _context.Products
            .Include(p => p.ProductBrand)
            .Include(p => p.ProductType)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new NotFoundException("Product not found");

        // Serialize the Product object to a byte array and store it in the cache
        var productData = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(productFromDb));
        await _redisCache.SetAsync(redisKey, productData);

        return productFromDb;
    }

    public async Task<IList<Product>> GetListAsync()
    {
        return await _context.Products
            .Include(p => p.ProductBrand)
            .Include(p => p.ProductType)
            .ToListAsync();
    }

    public async Task<IList<ProductBrand>> GetProductBrandsAsync()
    {
        return await _context.ProductBrands.ToListAsync();
    }


    public async Task<IList<ProductType>> GetProductTypesAsync()
    {
        return await _context.ProductTypes.ToListAsync();
    }

    private static string GetRedisProductsKey() => $"Products";
    private static string GetRedisProductKey(string id) => $"Product:{id}";
}
