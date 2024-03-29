using Core.Entities;

namespace Core.Repositories;

public interface IRepository<T> where T : BaseEntity
{
    Task<T> GetByIdAsync(int id);
    Task<IList<T>> GetListAsync();
    Task<IList<T>> GetProductBrandsAsync();
    Task<IList<T>> GetProductTypesAsync();
}
