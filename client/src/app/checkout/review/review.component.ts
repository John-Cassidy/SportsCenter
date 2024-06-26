import { Basket, BasketCheckout } from '../../shared/models/Basket';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BasketService } from '../../basket/basket.service';
import { CoreComponent } from '../../core';
import { SharedComponent } from '../../shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent implements OnInit, OnDestroy {
  @Input() reviewCheckout: BasketCheckout | null = null;
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

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.basketSubscription.unsubscribe();
  }
}
