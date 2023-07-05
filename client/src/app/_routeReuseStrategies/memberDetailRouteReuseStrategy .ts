import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from "@angular/router";

export class MemberDetailRouteReuseStrategy extends BaseRouteReuseStrategy {
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}