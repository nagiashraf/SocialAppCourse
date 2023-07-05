import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  currentUser$: Observable<User>;

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService,
    private membersService: MembersService) {}

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigate(['/members']);
      },
      error: error => {
        if (error.error) {
          this.toastr.error(error.error);
        }
    }});
  };

  logout() {
    this.accountService.logout();
    this.membersService.resetMemberCache();
    this.membersService.resetUserParams();
    this.router.navigate(['/']);
  }
}