import { Component, OnDestroy, OnInit } from '@angular/core';

import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
import { CoreComponent } from './core';
import { RouterOutlet } from '@angular/router';
import { SharedComponent } from './shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoreComponent, SharedComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription = new Subscription();
  constructor(
    private basketService: BasketService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.userSubscription.add(
      this.accountService.loadUser().subscribe(() => () => {})
    );
    this.loadBasket();

    let unix_timestamp = 1714677313;
    let date = new Date(unix_timestamp * 1000); // JavaScript uses milliseconds
    console.log(date);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId);
    }
  }
}
