using System.Linq.Expressions;
using Core.Specifications;

namespace Infrastructure.Specifications;

public abstract class BaseSpecification<T> : ISpecification<T>
{
    public Expression<Func<T, bool>> Criteria { get; private set; } = _ => true; // Default criteria to select all.
    public List<Expression<Func<T, object>>> Includes { get; } = new List<Expression<Func<T, object>>>();

    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }

    protected void ApplyCriteria(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    protected BaseSpecification(
            Expression<Func<T, bool>> filter = null,
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
    }
}