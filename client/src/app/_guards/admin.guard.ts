import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user) => {
        if (user.roles.some(role => role === 'Moderator' || role === 'Admin')) {
          return true;
        }
        this.router.navigate(['/not-found']);
        return false;
      }
    ))
  }
  
}
