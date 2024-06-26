import {
  Basket,
  BasketCheckout,
  BasketItem,
  BasketTotal,
} from '../shared/models/Basket';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

import { AccountService } from '../account/account.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/Product';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BasketService implements OnDestroy {
  private basketSubject: BehaviorSubject<Basket | null> =
    new BehaviorSubject<Basket | null>(null);
  public basketSubject$ = this.basketSubject.asObservable();

  private basketTotalSubject: BehaviorSubject<BasketTotal> =
    new BehaviorSubject<BasketTotal>({
      shipping: 0,
      subtotal: 0,
      total: 0,
    });
  public basketTotalSubject$ = this.basketTotalSubject.asObservable();

  private userSubscription: Subscription = new Subscription();

  private apiUrl = 'http://localhost:5096/basket';

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.listenToUserLogin();
  }

  private listenToUserLogin(): void {
    this.userSubscription.add(
      this.accountService.userSource$.subscribe((user) => {
        if (user) {
          this.updateBasketUserName(user.email);
        }
      })
    );
  }

  private updateBasketUserName(email: string): void {
    const basket = this.getBasketSubjectCurrentValue() ?? this.createBasket();
    if (basket) {
      basket.userName = email;
      this.setBasket(basket);
    }
  }

  public getBasket(id: string): Subscription {
    return this.http.get<Basket>(`${this.apiUrl}/${id}`).subscribe({
      next: (basket) => {
        this.basketSubject.next(basket);
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error fetching basket:', error);
      },
    });
  }

  public setBasket(basket: Basket): Subscription {
    return this.http.post<Basket>(this.apiUrl, basket).subscribe({
      next: (updatedBasket) => {
        this.basketSubject.next(updatedBasket);
        if (basket.id !== updatedBasket.id) {
          localStorage.setItem('basket_id', updatedBasket.id);
        }
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error updating basket:', error);
      },
    });
  }

  public checkoutBasket(basketCheckout: BasketCheckout): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http
        .post<boolean>(`${this.apiUrl}/checkout`, basketCheckout)
        .pipe(
          catchError((error) => {
            console.log('Error checkout basket;', error);
            return throwError(error);
          })
        )
        .subscribe({
          next: (result) => {
            if (result) {
              this.clearBasket();
              observer.next(true);
            } else {
              observer.next(false);
            }
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  public getBasketSubjectCurrentValue() {
    return this.basketSubject.value;
  }

  public clearBasket(): void {
    this.basketSubject.next(null);
    localStorage.removeItem('basket_id');
    this.basketTotalSubject.next({ shipping: 0, total: 0, subtotal: 0 });
  }

  public addItemToBasket(item: Product, quantity = 1) {
    const cartItem = this.mapProductToBasket(item);
    const basket = this.getBasketSubjectCurrentValue() ?? this.createBasket();
    basket.items = this.upsertItem(basket.items, cartItem, quantity);
    this.setBasket(basket);
  }

  //Basket methods
  public incrementItemQuantity(itemId: number, quantity: number = 1) {
    const basket = this.getBasketSubjectCurrentValue();
    if (basket) {
      const item = basket.items.find((p) => p.id === itemId);
      if (item) {
        item.quantity += quantity;
        if (item.quantity < 1) {
          item.quantity = 1; // Prevent negative quantity
        }
        this.setBasket(basket);
      }
    }
  }

  public decrementItemQuantity(itemId: number, quantity: number = 1) {
    const basket = this.getBasketSubjectCurrentValue();
    if (basket) {
      const item = basket.items.find((p) => p.id === itemId);
      if (item && item.quantity > 1) {
        item.quantity -= quantity;
        this.setBasket(basket);
      }
    }
  }

  public removeItem(itemId: number) {
    const basket = this.getBasketSubjectCurrentValue();
    if (basket) {
      const itemIndex = basket.items.findIndex((p) => p.id === itemId);
      if (itemIndex !== -1) {
        basket.items.splice(itemIndex, 1);
        this.setBasket(basket);

        // Check if the basket is empty after removing the item
        if (basket.items.length === 0) {
          // Clear the basket from local storage
          localStorage.removeItem('basket_id');
        }
      }
    }
  }

  private createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductToBasket(item: Product): BasketItem {
    const basketItem: BasketItem = {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      productBrand: item.productBrand,
      productType: item.productType,
    };

    return basketItem;
  }

  private upsertItem(
    items: BasketItem[],
    basketItem: BasketItem,
    quantity: number
  ): BasketItem[] {
    const item = items.find((p) => p.id === basketItem.id);
    if (item) {
      item.quantity += quantity;
    } else {
      basketItem.quantity = quantity;
      items.push(basketItem);
    }
    return items;
  }

  private calculateTotal() {
    const basket = this.getBasketSubjectCurrentValue();
    if (!basket) {
      this.basketTotalSubject.next({ shipping: 0, total: 0, subtotal: 0 });
      return;
    }
    const shipping = 0;
    const subtotal = basket.items.reduce((x, y) => y.price * y.quantity + x, 0);
    const total = subtotal + shipping;
    this.basketTotalSubject.next({ shipping, total, subtotal });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.userSubscription.unsubscribe();
  }
}
