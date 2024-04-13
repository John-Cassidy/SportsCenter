import { Component, OnInit } from '@angular/core';

import { BasketService } from './basket/basket.service';
import { CoreComponent } from './core';
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
  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.loadBasket();
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId);
    }
  }
}
