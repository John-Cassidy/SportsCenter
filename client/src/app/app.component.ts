import { Component, OnInit } from '@angular/core';

import { CoreComponent } from './core';
import { HttpClient } from '@angular/common/http';
import { Pagination } from './shared/models/Pagination';
import { Product } from './shared/models/Product';
import { RouterOutlet } from '@angular/router';
import { SharedComponent } from './shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoreComponent, SharedComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Sports Center';
  products: Pagination<Product> = {
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
    data: [],
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<Pagination<Product>>(
        'http://localhost:5096/products?Sort=NameAsc&Skip=0&Take=10'
      )
      .subscribe((response) => {
        this.products = response;
      });
  }
}
