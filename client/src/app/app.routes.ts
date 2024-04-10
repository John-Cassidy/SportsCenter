import { ConnectionRefusedComponent } from './core/connection-refused/connection-refused.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { Routes } from '@angular/router';
import { ServerErrorComponent } from './core/server-error/server-error.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Home' } },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { breadcrumb: 'Not Found' },
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    data: { breadcrumb: 'Server Error' },
  },
  {
    path: 'connection-refused',
    component: ConnectionRefusedComponent,
    data: { breadcrumb: 'Connection Refused' },
  },
  {
    path: 'store',
    loadChildren: () =>
      import('./store/store.routes').then((m) => m.STORE_ROUTES),
    data: { breadcrumb: 'Store' },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
