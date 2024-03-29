using System.Linq.Expressions;
using Core.Entities;

namespace Core.Repositories;

public interface IRepository<T> where T : BaseEntity
{
    Task<T> GetByIdAsync(int id, params Expression<Func<T, object>>[] includes);
    Task<IList<T>> GetListAsync(params Expression<Func<T, object>>[] includes);
    Task<IList<T>> GetProductBrandsAsync();
    Task<IList<T>> GetProductTypesAsync();
}
