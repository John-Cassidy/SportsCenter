using System.Linq.Expressions;
using Core.Entities;
using Core.Enums;
using Core.Exceptions;
using Core.Repositories;
using Core.Specifications;
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

    public async Task<IList<T>> GetListAsync(ISpecification<T> spec)
    {
        IQueryable<T> query = ApplySpecification(spec);
        return await query.ToListAsync();
    }

    public async Task<T> GetByIdAsync(ISpecification<T> spec)
    {
        IQueryable<T> query = ApplySpecification(spec);
        return await query.FirstOrDefaultAsync()
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

    public async Task<int> CountAsync(ISpecification<T> spec)
    {
        IQueryable<T> query = ApplySpecification(spec);
        return await query.CountAsync();
    }

    private IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        var query = _context.Set<T>().AsQueryable();

        if (spec.Criteria != null)
        {
            query = query.Where(spec.Criteria);
        }

        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

        if (spec.OrderBy != null)
        {
            if (spec.OrderByDirection == OrderBy.Ascending)
            {
                query = query.OrderBy(spec.OrderBy);
            }
            else if (spec.OrderByDirection == OrderBy.Descending)
            {
                query = query.OrderByDescending(spec.OrderBy);
            }
        }

        if (spec.IsPagingEnabled)
        {
            query = query.Skip(spec.Skip).Take(spec.Take);
        }

        return query;
    }
}
