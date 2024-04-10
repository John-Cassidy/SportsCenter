import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withHashLocation()),
    provideHttpClient(
      // registering interceptors
      withInterceptors([errorInterceptor])
    ),
    provideAnimations(), // required animations providers
    provideToastr({ timeOut: 2000, positionClass: 'toast-bottom-right' }), // Toastr providers
    importProvidersFrom(PaginationModule.forRoot()),
  ],
};
