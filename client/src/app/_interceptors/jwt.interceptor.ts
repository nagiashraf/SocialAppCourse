import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, map, switchMap, take } from 'rxjs';
import { AccountService } from './../_services/account.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  baseUrl = environment.apiUrl;

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.accountService.currentUser$.pipe(
      take(1),
      switchMap(currentUser => {
        if (currentUser && request.url !== this.baseUrl + 'tokens/refresh-token') {
          return this.accountService.refreshToken(currentUser).pipe(
            switchMap(user => {
              this.accountService.setCurrentUser(user);
              request = request.clone({
                setHeaders: { 
                  Authorization : `Bearer ${user?.token}`
                }
              })
              return next.handle(request);
          }))
        } else {
          return next.handle(request);
        }
    }))
  }
}