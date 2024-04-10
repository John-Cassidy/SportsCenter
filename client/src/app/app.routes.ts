import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { Routes } from '@angular/router';
import { ServerErrorComponent } from './core/server-error/server-error.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  {
    path: 'store',
    loadChildren: () =>
      import('./store/store.routes').then((m) => m.STORE_ROUTES),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
