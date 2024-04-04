import { Component, OnInit } from '@angular/core';

import { CoreComponent } from './core';
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
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
  products: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<Product[]>(
        'http://localhost:5096/products?Sort=NameAsc&Skip=0&Take=10'
      )
      .subscribe((data) => {
        this.products = data;
      });
  }
}
