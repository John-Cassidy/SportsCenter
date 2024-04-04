import { APP_ROUTES } from './app.routes';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(APP_ROUTES), provideHttpClient()],
};
