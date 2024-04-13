import { BasketItem } from '../../shared/models/Basket';
import { BasketService } from '../../basket/basket.service';
import { Component } from '@angular/core';
import { CoreComponent } from '..';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  constructor(public basketService: BasketService) {}

  getBasketCount(items: BasketItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
