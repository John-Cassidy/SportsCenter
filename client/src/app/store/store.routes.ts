import { Routes } from '@angular/router';
import { StoreComponent } from './store.component';

export const STORE_ROUTES: Routes = [
  {
    path: '',
    component: StoreComponent,
    children: [
      // {
      //     path: 'products',
      //     component: ProductsComponent
      // },
      // {
      //     path: 'cart',
      //     component: CartComponent
      // },
      // {
      //     path: 'checkout',
      //     component: CheckoutComponent
      // }
    ],
  },
];
