using Core.Entities;
using Core.Exceptions;
using Core.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    private readonly SportsCenterContext _context;

    public Repository(SportsCenterContext context)
    {
        _context = context;
    }

    public async Task<IList<T>> GetListAsync()
    {
        var entity = _context.Set<T>();
        if (typeof(T) == typeof(Product))
            entity
                .Include(p => (p as Product)!.ProductBrand)
                .Include(p => (p as Product)!.ProductType);
        return await entity.ToListAsync();
    }

    public async Task<T> GetByIdAsync(int id)
    {
        var entity = _context.Set<T>();
        if (typeof(T) == typeof(Product))
            entity
                .Include(p => (p as Product)!.ProductBrand)
                .Include(p => (p as Product)!.ProductType);

        return await entity.FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new NotFoundException($"{typeof(T).Name} not found.");
    }

    public async Task<IList<T>> GetProductBrandsAsync()
    {
        if (typeof(T) == typeof(ProductBrand))
        {
            return (IList<T>)await _context.Set<T>().ToListAsync();
        }
        throw new InvalidOperationException("Cannot retrieve ProductBrands from this repository.");
    }

    public async Task<IList<T>> GetProductTypesAsync()
    {
        if (typeof(T) == typeof(ProductType))
        {
            return (IList<T>)await _context.Set<T>().ToListAsync();
        }
        throw new InvalidOperationException("Cannot retrieve ProductTypes from this repository.");
    }
}
