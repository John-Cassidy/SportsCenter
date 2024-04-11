import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';

import { LoadingService } from '../services/loading.service';
import { inject } from '@angular/core';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingService: LoadingService = inject(LoadingService);
  loadingService.loading();
  return next(req).pipe(
    delay(1000),
    finalize(() => {
      loadingService.idle();
    })
  );
};
