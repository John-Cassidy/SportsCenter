import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CoreComponent } from '../core';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { SharedComponent } from '../shared';
import { StoreService } from './store.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, CoreComponent, SharedComponent],
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

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.storeService.getProducts('NameAsc', 0, 10).subscribe((response) => {
      this.products = response;
    });
  }
}
