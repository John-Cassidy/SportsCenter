import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AccountService } from '../account/account.service';
import { Address } from '../shared/models/Address';
import { AddressComponent } from './address/address.component';
import { BasketCheckout } from '../shared/models/Basket';
import { BasketService } from '../basket/basket.service';
import { CheckoutService } from './checkout.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CoreComponent } from '../core';
import { DeliveryOption } from '../shared/models/DeliveryOption';
import { OrderSummaryComponent } from '../shared/order-summary/order-summary.component';
import { ReviewComponent } from './review/review.component';
import { SharedComponent } from '../shared';
import { ShipmentComponent } from './shipment/shipment.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CoreComponent,
    SharedComponent,
    OrderSummaryComponent,
    ShipmentComponent,
    AddressComponent,
    ReviewComponent,
    ConfirmationComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  basketCheckout: BasketCheckout = new BasketCheckout();
  confirmationCheckout: BasketCheckout | null = null;
  private subscriptions: Subscription[] = [];

  currentStep: 'address' | 'shipment' | 'review' | 'confirmation' = 'address';

  setCurrentStep(step: 'address' | 'shipment' | 'review' | 'confirmation') {
    this.currentStep = step;
  }

  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.basketService.basketSubject$.subscribe((basket) => {
        if (basket) {
          this.basketCheckout.basketId = basket.id;
          this.basketCheckout.userName = basket.userName;
        }
      })
    );

    // Subscribe to basketTotalSubject$ observable
    this.subscriptions.push(
      this.basketService.basketTotalSubject$.subscribe((basketTotal) => {
        this.basketCheckout.basketTotal = basketTotal;
      })
    );

    const userAddress = this.accountService.getUserAddress();
    if (userAddress && userAddress.address) {
      this.basketCheckout.shippingAddress = userAddress.address;
    }
  }

  onAddressSubmitted(address: Address): void {
    this.basketCheckout.shippingAddress = address;
    this.setCurrentStep('shipment');
  }

  onShippingOptionSubmitted(deliveryOption: DeliveryOption): void {
    this.basketCheckout.setDeliveryOption(deliveryOption);
    this.setCurrentStep('review');
  }

  submitCheckout(): void {
    if (this.basketCheckout.validate()) {
      this.confirmationCheckout = JSON.parse(
        JSON.stringify(this.basketCheckout)
      );
      this.basketService.checkoutBasket(this.basketCheckout).subscribe(
        (result) => {
          if (result) {
            // checkout successful
            this.toastr.success('Checkout successful');
            this.setCurrentStep('confirmation');
          } else {
            // checkout failed
            // Show a Toastr error message
            this.toastr.error('Checkout failed');
          }
        },
        (error) => {
          // handle error
          console.log('Error:', error);
          // Show a Toastr error message
          this.toastr.error('Checkout failed');
        }
      );
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
