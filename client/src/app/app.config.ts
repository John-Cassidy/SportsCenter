import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withHashLocation()),
    provideHttpClient(
      // registering interceptors
      withInterceptors([errorInterceptor])
    ),
    importProvidersFrom(PaginationModule.forRoot()),
  ],
};
