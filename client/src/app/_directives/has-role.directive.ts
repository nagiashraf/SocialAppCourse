import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() hasRole: string[];
  private hasView = false;
  private userRoles: string[];

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.userRoles = user?.roles);
  }

  ngOnInit(): void {
    const showView = this.userRoles?.some(role => this.hasRole.includes(role));
    if (showView && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!showView && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
