using System.Linq.Expressions;
using Core.Entities;
using Core.Specifications;

namespace Core.Repositories;

public interface IRepository<T> where T : BaseEntity
{
    Task<T> GetByIdAsync(ISpecification<T> spec);
    Task<IList<T>> GetListAsync(ISpecification<T> spec);
    Task<IList<T>> GetProductBrandsAsync();
    Task<IList<T>> GetProductTypesAsync();
}
