using Core.Entities;
using Core.Repositories;
using Infrastructure.Data;
using Infrastructure.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    // add SportsCenterContext and inject it in the constructor
    private readonly SportsCenterContext _context;

    public ProductRepository(SportsCenterContext context)
    {
        _context = context;
    }


    public async Task<Product> GetProductByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.ProductBrand)
            .Include(p => p.ProductType)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new NotFoundException("Product not found");
    }

    public async Task<IList<Product>> GetProductsAsync()
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
}
