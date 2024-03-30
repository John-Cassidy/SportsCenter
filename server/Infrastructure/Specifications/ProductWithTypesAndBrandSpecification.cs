using Core.Entities;
using Infrastructure.Specifications;

namespace Infrastructure.Specifications;

public class ProductWithTypesAndBrandSpecification : BaseSpecification<Product>
{
    public ProductWithTypesAndBrandSpecification(string sort, int? productTypeId = null, int? productBrandId = null)
    {
        AddInclude(p => p.ProductBrand);
        AddInclude(p => p.ProductType);

        // Apply filtering based on product type And product brand
        if (productBrandId.HasValue || productTypeId.HasValue)
        {
            // Combine the conditions using And operator
            ApplyCriteria(p =>
                (!productBrandId.HasValue || p.ProductBrandId == productBrandId.Value) &&
                (!productTypeId.HasValue || p.ProductTypeId == productTypeId.Value));
        }

        // Default sorting by name in ascending order
        ApplyOrderBy(p => p.Name, Core.Enums.OrderBy.Ascending);

        // Parse and apply sorting based on the 'sort' parameter
        if (!string.IsNullOrEmpty(sort))
        {
            switch (sort.ToLower())
            {
                case "priceasc":
                    ApplyOrderBy(p => p.Price, Core.Enums.OrderBy.Ascending);
                    break;
                case "pricedesc":
                    ApplyOrderBy(p => p.Price, Core.Enums.OrderBy.Descending);
                    break;
                case "namedesc":
                    ApplyOrderBy(p => p.Name, Core.Enums.OrderBy.Descending);
                    break;
                // Add more sorting options as needed
                default:
                    ApplyOrderBy(p => p.Name, Core.Enums.OrderBy.Ascending);
                    break;
            }
        }
    }

    public ProductWithTypesAndBrandSpecification(int id) : base(p => p.Id == id)
    {
        AddInclude(p => p.ProductBrand);
        AddInclude(p => p.ProductType);
    }
}