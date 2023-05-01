import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        switch (error.status) {
          case 400:
            const modelStateErrors = [];
            for (let key in error.error.errors) {
              if (error.error.errors[key]) {
                modelStateErrors.push(error.error.errors[key]);
              }
            }
            console.log(modelStateErrors.flat())
            throw modelStateErrors.flat();
          case 404:
            this.router.navigate(['/not-found']);
            break;
          case 500:
            this.router.navigate(['/server-error']);
            break;
          default:
            break;
        }
        throw error;
      })
    );
  }
}
