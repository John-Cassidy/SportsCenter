import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { CarouselModule } from 'ngx-bootstrap/carousel'; // Import the CarouselModule from the correct module
import { LoadingService } from './core/services/loading.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { authHttpInterceptor } from './core/interceptors/auth-http.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    LoadingService,
    provideRouter(APP_ROUTES, withHashLocation()),
    provideHttpClient(
      // registering interceptors
      withInterceptors([
        errorInterceptor,
        loadingInterceptor,
        authHttpInterceptor,
      ])
    ),
    provideAnimations(), // required animations providers
    provideToastr({ timeOut: 2000, positionClass: 'toast-bottom-right' }), // Toastr providers
    importProvidersFrom(PaginationModule.forRoot(), CarouselModule.forRoot()),
  ],
};
