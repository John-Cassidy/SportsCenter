import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import { APP_ROUTES } from './app.routes';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    importProvidersFrom(PaginationModule.forRoot()),
  ],
};
