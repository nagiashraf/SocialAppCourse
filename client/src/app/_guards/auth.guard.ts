import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountSerivce: AccountService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.accountSerivce.currentUser$.pipe(
      map((user) => {
        if (user) return true;
        this.router.navigate(['/']);
        return false;
      }
    ))
  }
  
}
