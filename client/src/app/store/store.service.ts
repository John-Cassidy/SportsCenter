import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrl = 'http://localhost:5096/products';

  constructor(private http: HttpClient) {}

  getProducts(
    sort: string,
    skip: number,
    take: number
  ): Observable<Pagination<Product>> {
    let params = new HttpParams()
      .set('sort', sort)
      .set('skip', skip.toString())
      .set('take', take.toString());

    return this.http.get<Pagination<Product>>(this.apiUrl, { params });
  }
}
