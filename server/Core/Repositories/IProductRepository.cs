using Core.Entities;

namespace Core.Repositories;

public interface IProductRepository
{
    Task<Product> GetByIdAsync(int id);
    Task<IList<Product>> GetListAsync();
    Task<IList<ProductBrand>> GetProductBrandsAsync();
    Task<IList<ProductType>> GetProductTypesAsync();
}