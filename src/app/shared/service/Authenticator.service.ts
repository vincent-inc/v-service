import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Jwt, Route, User, UserRole } from '../model/Authenticator.model';
import { SettingService } from './Setting.service';
import { Observable, first, interval } from 'rxjs';
import { UsernameExistResponse } from '../model/Response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  jwt?: string | null;
  currentUser: User | undefined | null;
  isLoginB: boolean = false;

  private prefix = "authenticator"

  constructor(private httpClient: HttpClient, private router: Router, private settingService: SettingService) { 
    this.jwt = localStorage.getItem("jwt");
    setInterval(() => {
      this.isLoginCall();
    }, 120000); //2 mins
  }

  healthCheck(): Observable<string> {
    return this.httpClient.get<string>(`${this.settingService.getGatewayUrl()}/_status/healthz`);
  }

  // Authentication
  login(user: {username: string, password: string}): Observable<Jwt>{
    return this.httpClient.post<Jwt>(`${this.settingService.getGatewayUrl()}/${this.prefix}/auth/login`, user);
  }

  private async updateUser(): Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {
      this.httpClient.get<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users`)
      .pipe(first()).subscribe(
        res => {
          this.currentUser = res;
          this.isLoginB = true;
          resolve(true);
        },
        error => {
          this.currentUser = null;
          this.isLoginB = false;
          resolve(false);
        },
        () => resolve(true)
      );
    });
  }

  async autoUpdateUserWithJwt(jwt: string): Promise<void>
  {
    this.jwt = jwt;
    localStorage.setItem("jwt", jwt);
    await this.autoUpdateUser();
  }

  async autoUpdateUser(): Promise<void>
  {
    await this.updateUser().then().catch();
  }

  async isLoginCall(): Promise<void> {
    
    await this.updateUser().then(b => this.isLoginB = b);
  }

  async isLoginCallWithReroute(navigate?: string): Promise<void> {

    let isLogin = await this.updateUser();
    this.isLoginB = isLogin;

    if(isLogin && navigate)
      this.router.navigate([navigate]);
    else if(!isLogin)
      this.router.navigate(["/login"]);
  }

  isLogin(): Observable<void> {
    return this.httpClient.get<void>(`${this.settingService.getGatewayUrl()}/${this.prefix}/auth`);
  }

  logout(): void {
    localStorage.removeItem("jwt");
    this.isLoginB = false;
    this.httpClient.get<void>(`${this.settingService.getGatewayUrl()}/${this.prefix}/auth/logout`).pipe(first()).subscribe(
      res => {},
      error => {},
      () => {
        this.jwt = null;
        this.router.navigate(["/login"]);
      }
    );
  }

  getJwt(): string {
    if(this.jwt === null || this.jwt === undefined)
      this.router.navigate(['login']);
    return this.jwt!;
  }

  // USERs
  public getCurrentLoginUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users`);
  }

  public isUsernameExist(username: string): Observable<UsernameExistResponse> {
    return this.httpClient.get<UsernameExistResponse>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/username/${username}`);
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/all`);
  }

  public getUsers(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/${id}`);
  }

  public postUsers(User: User): Observable<User> {
    return this.httpClient.post<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users`, User);
  }

  public putUsers(User: User): Observable<User> {
    return this.httpClient.put<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/${User.id}`, User);
  }

  public patchUsers(User: User): Observable<User> {
    return this.httpClient.patch<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/${User.id}`, User);
  }

  public deleteUsers(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/${id}`);
  }

  //UserRoles
  public getAllRoles(): Observable<UserRole[]> {
    return this.httpClient.get<UserRole[]>(`${this.settingService.getGatewayUrl()}/${this.prefix}/roles`);
  }

  //Routes
  public getAllRoutes(): Observable<Route[]> {
    return this.httpClient.get<Route[]>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes`);
  }

  public getRoutes(id: number): Observable<Route> {
    return this.httpClient.get<Route>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes/${id}`);
  }

  public postRoutes(route: Route): Observable<Route> {
    return this.httpClient.post<Route>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes`, route);
  }

  public putRoutes(route: Route): Observable<Route> {
    return this.httpClient.put<Route>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes/${route.id}`, route);
  }

  public patchRoutes(route: Route): Observable<Route> {
    return this.httpClient.patch<Route>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes/${route.id}`, route);
  }

  public deleteRoutes(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes/${id}`);
  }
}
