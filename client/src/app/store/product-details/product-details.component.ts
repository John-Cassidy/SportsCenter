import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '../../core';
import { Product } from '../../shared/models/Product';
import { SharedComponent } from '../../shared';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  quantity: number = 1;

  constructor(
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.storeService.getProduct(+id).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error) => console.log(error),
      });
    }
  }

  addToCart() {}

  // Method to increment the quantity
  incrementQuantity() {
    this.quantity++;
  }

  // Method to decrement the quantity (prevent negative values)
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
