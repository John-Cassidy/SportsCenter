import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'store',
    loadChildren: () =>
      import('./store/store.routes').then((m) => m.STORE_ROUTES),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
