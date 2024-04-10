import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CoreComponent } from '../core';
import { Pagination } from '../shared/models/Pagination';
import { PaginationHeaderComponent } from '../shared/components/pagination-header/pagination-header.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Product } from '../shared/models/Product';
import { ProductBrand } from '../shared/models/ProductBrand';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductType } from '../shared/models/ProductType';
import { SharedComponent } from '../shared';
import { StoreParams } from '../shared/models/storeParams';
import { StoreService } from './store.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CoreComponent,
    SharedComponent,
    PaginationModule,
    ProductItemComponent,
    PaginationHeaderComponent,
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  products: Pagination<Product> = {
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
    data: [],
  };
  brands: ProductBrand[] = [];
  types: ProductType[] = [];
  params: StoreParams = new StoreParams();
  pageNumber = 1;
  sortOptions = [
    { name: 'Name Ascending', value: 'NameAsc' },
    { name: 'Name Descending', value: 'NameDesc' },
    { name: 'Price Low to High', value: 'PriceAsc' },
    { name: 'Price High to Low', value: 'PriceDesc' },
  ];

  constructor(
    private storeService: StoreService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getBrands();
    this.getTypes();
    this.getProducts();
  }

  private getBrands() {
    this.storeService.getBrands().subscribe({
      next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  private getTypes() {
    this.storeService.getTypes().subscribe({
      next: (response) => (this.types = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  private getProducts() {
    this.storeService.getProducts(this.params).subscribe({
      next: (response) => {
        this.products = response;
        this.pageNumber =
          response.pageIndex >= response.pageSize
            ? response.pageIndex / response.pageSize + 1
            : 1;
        this.toastr.success('Products returned successfully', 'Success');
      },
      error: (error) => console.log(error),
    });
  }

  selectBrand(brandId: number) {
    this.params.productBrandId = brandId;
    this.getProducts();
  }

  selectType(typeId: number) {
    this.params.productTypeId = typeId;
    this.getProducts();
  }

  onSearch() {
    this.params.search = this.searchTerm?.nativeElement.value;
    this.params.skip = 0;
    this.params.productBrandId = 0;
    this.params.productTypeId = 0;
    this.getProducts();
  }

  onReset() {
    // Reset the search params and fetch the original list of products
    if (this.searchTerm) {
      this.searchTerm.nativeElement.value = '';
    }
    this.params.skip = 0;
    this.params.take = 10;
    this.params.sort = 'NameAsc';
    this.params.productBrandId = 0;
    this.params.productTypeId = 0;
    this.params.search = '';
    this.pageNumber = 1;
    this.getProducts();
  }

  onPageChanged(event: any) {
    this.params.skip = (event.page - 1) * this.products.pageSize;

    this.getProducts();
  }

  onSortChange(sort: string) {
    this.params.sort = sort;
    this.getProducts();
  }
}
