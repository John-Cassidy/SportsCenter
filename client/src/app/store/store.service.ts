import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { ProductBrand } from '../shared/models/ProductBrand';
import { ProductType } from '../shared/models/ProductType';
import { StoreParams } from '../shared/models/storeParams';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrl = 'http://localhost:5096/products';

  constructor(private http: HttpClient) {}

  getProducts(httpParams: StoreParams): Observable<Pagination<Product>> {
    let params = new HttpParams()
      .set('sort', httpParams.sort)
      .set('skip', httpParams.skip.toString())
      .set('take', httpParams.take.toString());

    if (httpParams.productBrandId !== 0) {
      params = params.set(
        'productBrandId',
        httpParams.productBrandId.toString()
      );
    }

    if (httpParams.productTypeId !== 0) {
      params = params.set('productTypeId', httpParams.productTypeId.toString());
    }

    if (httpParams.search) {
      params = params.set('search', httpParams.search); // Add the search parameter to the query
    }

    return this.http.get<Pagination<Product>>(this.apiUrl, {
      params,
    });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getBrands(): Observable<ProductBrand[]> {
    return this.http.get<ProductBrand[]>(`${this.apiUrl}/brands`);
  }

  getTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.apiUrl}/types`);
  }
}
