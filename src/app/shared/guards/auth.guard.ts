import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticatorService } from '../service/Authenticator.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate /*, CanActivateChild, CanDeactivate<unknown>, CanLoad */
{
  constructor(private authenticatorService: AuthenticatorService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // const checkLogin = async () => {
    //   await this.userService.autoCheckSessionLogin()
    // }
    
    // this.userService.autoUpdateUser().then(() => {
    //   if(!this.userService.isLogin())
    //     this.router.navigate(['/login']).catch();
    // });
    
    // (async () => await this.userService.checkIsLogin())();

    // if(!this.authenticatorService.isLogin())
    //   this.router.navigate(['/login']).catch();

    // return this.authenticatorService.isLogin();
    return false;
  }
  
  // canActivateChild(
  //   childRoute: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canDeactivate(
  //   component: unknown,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  //   console.log('can load');

  //   return false;
  // }
}
