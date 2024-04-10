import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Toast, ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router: Router = inject(Router);
  const toastr: ToastrService = inject(ToastrService);
  console.log('error interceptor...');

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        if (error.status === 404) {
          toastr.error('Page not found', '404 Error');
          router.navigateByUrl('/not-found');
        }
        if (error.status >= 500) {
          toastr.error('Server error', '500 Error');
          router.navigateByUrl('/server-error');
        } else if (error.status === 0) {
          // Handle connection refused or no network error
          toastr.error('Connection error!', 'Error'); // Display error message using Toastr
          router.navigate(['/connection-refused']);
        }
      }
      return throwError(() => new Error(error));
    })
  );
};
