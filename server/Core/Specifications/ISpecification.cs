﻿using System.Linq.Expressions;
using Core.Enums;

namespace Core.Specifications;

public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
    List<Expression<Func<T, object>>> Includes { get; }
    Expression<Func<T, object>> OrderBy { get; }
    OrderBy OrderByDirection { get; }
    int Skip { get; }
    int Take { get; }
    bool IsPagingEnabled { get; }
}
