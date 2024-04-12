using System.Linq.Expressions;
using System.Text;
using System.Text.Json;
using Core.Entities;
using Core.Enums;
using Core.Exceptions;
using Core.Repositories;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    private readonly SportsCenterContext _context;
    private readonly IDistributedCache _redisCache;

    public Repository(SportsCenterContext context, IDistributedCache redisCache)
    {
        _context = context;
        _redisCache = redisCache;
    }

    public async Task<IList<T>> GetListAsync(ISpecification<T> spec)
    {
        IQueryable<T> query = ApplySpecification(spec);
        return await query.ToListAsync();
    }

    public async Task<T> GetByIdAsync(ISpecification<T> spec)
    {
        int? id = GetIdFromSpec(spec);
        if (id.HasValue)
        {
            string redisKey = GetRedisKey(id.Value.ToString(), typeof(T).Name);
            var cache = await _redisCache.GetAsync(redisKey);

            if (cache != null)
            {
                // Deserialize the byte array to a T object
                var cacheObject = JsonSerializer.Deserialize<T>(Encoding.UTF8.GetString(cache));
                if (cacheObject != null) return cacheObject;
            }
        }

        IQueryable<T> query = ApplySpecification(spec);
        var data = await query.FirstOrDefaultAsync()
            ?? throw new NotFoundException($"{typeof(T).Name} not found.");

        if (id.HasValue)
        {
            string redisKey = GetRedisKey(id.Value.ToString(), typeof(T).Name);
            var dataBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(data));
            await _redisCache.SetAsync(redisKey, dataBytes);
        }

        return data;
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

    private string GetRedisKey(string id, string name) => $"{name}:{id}";

    private int? GetIdFromSpec(ISpecification<T> spec)
    {
        if (spec.Criteria is Expression<Func<Product, bool>> criteria)
        {
            if (criteria.Body is BinaryExpression binaryExpression)
            {
                // Check if the left side of the binary expression is a member access expression
                if (binaryExpression.Left is MemberExpression memberExpression)
                {
                    // Convert the right side of the binary expression to an object
                    var convertedExpression = Expression.Convert(binaryExpression.Right, typeof(object));
                    // Compile and invoke the expression to get the value
                    var value = Expression.Lambda<Func<object>>(convertedExpression).Compile().Invoke();
                    if (value is int id)
                    {
                        return id;
                    }
                }
            }
        }
        return null;
    }
}
