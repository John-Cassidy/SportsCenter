import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CoreComponent } from '../core';
import { Pagination } from '../shared/models/Pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Product } from '../shared/models/Product';
import { ProductBrand } from '../shared/models/ProductBrand';
import { ProductType } from '../shared/models/ProductType';
import { SharedComponent } from '../shared';
import { StoreParams } from '../shared/models/storeParams';
import { StoreService } from './store.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, CoreComponent, SharedComponent, PaginationModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  products: Pagination<Product> = {
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
    data: [],
  };
  brands: ProductBrand[] = [];
  types: ProductType[] = [];
  params: StoreParams = new StoreParams();
  totalCount = 0;

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.getBrands();
    this.getTypes();
    this.getProducts();
  }

  private getBrands() {
    this.storeService.getBrands().subscribe((response) => {
      this.brands = response;
    });
  }

  private getTypes() {
    this.storeService.getTypes().subscribe((response) => {
      this.types = response;
    });
  }

  private getProducts() {
    this.storeService.getProducts(this.params).subscribe((response) => {
      this.products = response;
      this.totalCount = response.totalItems;
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

  onPageChanged(event: any) {
    this.params.skip = (event.page - 1) * this.products.pageSize;

    this.getProducts();
  }
}
