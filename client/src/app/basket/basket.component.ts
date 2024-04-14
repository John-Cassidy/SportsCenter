import { Component, OnDestroy, OnInit } from '@angular/core';

import { Basket } from '../shared/models/Basket';
import { BasketService } from './basket.service';
import { CoreComponent } from '../core';
import { OrderSummaryComponent } from '../shared/order-summary/order-summary.component';
import { SharedComponent } from '../shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CoreComponent, SharedComponent, OrderSummaryComponent],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent implements OnInit, OnDestroy {
  basket: Basket | null = new Basket();
  private basketSubscription: Subscription = new Subscription();

  constructor(private basketService: BasketService) {}

  ngOnInit() {
    this.basketSubscription.add(
      this.basketService.basketSubject$.subscribe((basket) => {
        this.basket = basket ?? new Basket();
      })
    );
  }

  incrementQuantity(itemId: number) {
    this.basketService.incrementItemQuantity(itemId);
  }

  decrementQuantity(itemId: number) {
    this.basketService.decrementItemQuantity(itemId);
  }

  removeItem(itemId: number) {
    this.basketService.removeItem(itemId);
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.basketSubscription.unsubscribe();
  }
}
