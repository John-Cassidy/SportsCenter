import { AccountService } from '../../account/account.service';
import { BasketItem } from '../../shared/models/Basket';
import { BasketService } from '../../basket/basket.service';
import { Component } from '@angular/core';
import { CoreComponent } from '..';
import { Observable } from 'rxjs';
import { SharedComponent } from '../../shared';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  currentUser$?: Observable<User | null>;

  constructor(
    public basketService: BasketService,
    public accountService: AccountService
  ) {
    this.currentUser$ = this.accountService.userSource$;
  }

  getBasketCount(items: BasketItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  logout() {
    this.accountService.logout().subscribe({
      next: (result) => {
        console.log('Logout result:', result);
      },
      error: (error) => {
        console.error('Error in logout:', error);
      },
    });
  }
}
