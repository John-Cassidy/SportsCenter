import { ProductDetailsComponent } from './product-details/product-details.component';
import { Routes } from '@angular/router';
import { StoreComponent } from './store.component';

export const STORE_ROUTES: Routes = [
  {
    path: '',
    component: StoreComponent,
  },
  {
    path: ':id',
    component: ProductDetailsComponent,
    data: { breadcrumb: { alias: 'productDetails' } },
  },
];
