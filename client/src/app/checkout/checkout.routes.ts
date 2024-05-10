import { AddressComponent } from './address/address.component';
import { CheckoutComponent } from './checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ReviewComponent } from './review/review.component';
import { Routes } from '@angular/router';
import { ShipmentComponent } from './shipment/shipment.component';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    children: [
      // { path: 'address', component: AddressComponent },
      // { path: 'shipment', component: ShipmentComponent },
      // { path: 'review', component: ReviewComponent },
      // { path: 'confirmation', component: ConfirmationComponent },
      { path: '', redirectTo: 'address', pathMatch: 'full' },
    ],
  },
];
