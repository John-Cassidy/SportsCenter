import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router: Router = inject(Router);
  console.log('error interceptor...');

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        if (error.status === 404) {
          router.navigateByUrl('/not-found');
        }       
        if (error.status >= 500) {
          router.navigateByUrl('/server-error');
        }
      }
      return throwError(() => new Error(error));
    })
  );
};
