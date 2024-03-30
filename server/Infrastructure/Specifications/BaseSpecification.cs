using System.Linq.Expressions;
using Core.Specifications;

namespace Infrastructure.Specifications;

public abstract class BaseSpecification<T> : ISpecification<T>
{
    public Expression<Func<T, bool>> Criteria { get; private set; } = _ => true; // Default criteria to select all.
    public List<Expression<Func<T, object>>> Includes { get; } = new List<Expression<Func<T, object>>>();
    public Expression<Func<T, object>> OrderBy { get; private set; } = null;
    public Core.Enums.OrderBy OrderByDirection { get; private set; }

    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }

    protected void ApplyCriteria(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    protected void ApplyOrderBy(Expression<Func<T, object>> orderBy, Core.Enums.OrderBy direction)
    {
        OrderBy = orderBy;
        OrderByDirection = direction;
    }

    protected BaseSpecification(
            Expression<Func<T, bool>> filter = null,
            Expression<Func<T, object>> orderBy = null,
            Core.Enums.OrderBy orderByDirection = Core.Enums.OrderBy.Ascending,
            List<Expression<Func<T, object>>> includes = null)
    {
        if (filter != null)
        {
            Criteria = filter;
        }

        if (includes != null)
        {
            Includes = includes;
        }

        OrderByDirection = Core.Enums.OrderBy.Ascending;

        if (orderBy != null)
        {
            OrderBy = orderBy;
            OrderByDirection = orderByDirection;
        }
    }
}