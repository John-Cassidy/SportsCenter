using Core.Entities;

namespace Core.Repositories;

[Obsolete("This class is obsolete. Use IRepository<T> instead.", true)]
public interface IProductRepository
{
    Task<Product> GetByIdAsync(int id);
    Task<IList<Product>> GetListAsync();
    Task<IList<ProductBrand>> GetProductBrandsAsync();
    Task<IList<ProductType>> GetProductTypesAsync();
}