using Core.Entities;

namespace Infrastructure.Specifications;

public class ProductCountSpecification : BaseSpecification<Product>
{
    public ProductCountSpecification(int? productTypeId, int? productBrandId, string? search = null)
    {
        // Apply filtering based on product type And product brand
        if (productBrandId.HasValue || productTypeId.HasValue)
        {
            // Combine the conditions using And operator
            ApplyCriteria(p =>
                (!productBrandId.HasValue || p.ProductBrandId == productBrandId.Value) &&
                (!productTypeId.HasValue || p.ProductTypeId == productTypeId.Value));
        }

        if (!string.IsNullOrEmpty(search))
        {
            ApplyCriteria(p => p.Name.ToLower().Contains(search.ToLower()));
        }
    }
}
