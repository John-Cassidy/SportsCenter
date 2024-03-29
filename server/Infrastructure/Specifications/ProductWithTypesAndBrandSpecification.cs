using Core.Entities;
using Infrastructure.Specifications;

namespace Infrastructure.Specifications;

public class ProductWithTypesAndBrandSpecification : BaseSpecification<Product>
{
    public ProductWithTypesAndBrandSpecification(int? productTypeId = null, int? productBrandId = null)
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
    }

    public ProductWithTypesAndBrandSpecification(int id) : base(p => p.Id == id)
    {
        AddInclude(p => p.ProductBrand);
        AddInclude(p => p.ProductType);
    }
}