import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Jwt, OpenIdRequest, Route, User, UserRole } from '../model/Authenticator.model';
import { SettingService } from './Setting.service';
import { Observable, first, interval } from 'rxjs';
import { UsernameExistResponse } from '../model/Response.model';
import { Time } from '../model/Mat.model';

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
  

  private async updateUser(): Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {
      this.httpClient.get<User>(`${this.settingService.getGatewayUrl()}/user`)
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
      this.router.navigate(["/home"]);
  }

  logoutWithoutReroute(): void {
    localStorage.removeItem("jwt");
    this.isLoginB = false;
    this.httpClient.get<void>(`${this.settingService.getGatewayUrl()}/logout`).pipe(first()).subscribe(
      res => {},
      error => {},
      () => {
        this.jwt = null;
      }
    );
  }
  
  logout(): void {
    this.logoutWithoutReroute();
    this.router.navigate(["/login"]);
  }

  getJwt(): string | null | undefined {
    return this.jwt;
  }

  getJwtWithReroute(): string {
    if(this.jwt === null || this.jwt === undefined)
      this.router.navigate(['login']);
    return this.jwt!;
  }

  async getTime(): Promise<Time> {
    return new Promise<Time>((resolve, reject) => {
      this.httpClient.get<Time>(`${this.settingService.getGatewayUrl()}/time/now`).pipe(first()).subscribe(
        res => resolve(res),
        error => reject()
      );
    })
  }

  //special endpoint
  getCurrentLoginUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.settingService.getGatewayUrl()}/user`);
  }

  registerUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.settingService.getGatewayUrl()}/register`, user);
  }

  isLogin(): Observable<void> {
    return this.httpClient.get<void>(`${this.settingService.getGatewayUrl()}/auth`);
  }

  login(user: {username: string, password: string}): Observable<Jwt>{
    return this.httpClient.post<Jwt>(`${this.settingService.getGatewayUrl()}/login`, user);
  }

  loginWithOpenId(openIdRequest: OpenIdRequest) {
    return this.httpClient.post<Jwt>(`${this.settingService.getGatewayUrl()}/openId`, openIdRequest);
  }

  modifyCurrentUser(user: User) {
    return this.httpClient.put<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/auth/user`, user);
  }

  patchCurrentUser(user: User) {
    return this.httpClient.patch<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/auth/user`, user);
  }

  // USERs
  public getUserWithGateway(): Observable<User> {
    return this.httpClient.get<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users`);
  }

  public isUsernameExist(username: string): Observable<UsernameExistResponse> {
    return this.httpClient.get<UsernameExistResponse>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/username/${username}`);
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/all`);
  }

  public getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/${id}`);
  }

  public postUser(User: User): Observable<User> {
    return this.httpClient.post<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users`, User);
  }

  public putUser(User: User): Observable<User> {
    return this.httpClient.put<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/${User.id}`, User);
  }

  public patchUser(User: User): Observable<User> {
    return this.httpClient.patch<User>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/${User.id}`, User);
  }

  public deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.settingService.getGatewayUrl()}/${this.prefix}/users/${id}`);
  }

  //UserRoles
  public getUserRoles(): Observable<UserRole[]> {
    return this.httpClient.get<UserRole[]>(`${this.settingService.getGatewayUrl()}/${this.prefix}/roles`);
  }

  public getUserRole(id: number): Observable<UserRole> {
    return this.httpClient.get<UserRole>(`${this.settingService.getGatewayUrl()}/${this.prefix}/roles/${id}`);
  }

  public postUserRole(role: UserRole): Observable<UserRole> {
    return this.httpClient.post<UserRole>(`${this.settingService.getGatewayUrl()}/${this.prefix}/roles`, role);
  }

  public putUserRole(role: UserRole): Observable<UserRole> {
    return this.httpClient.put<UserRole>(`${this.settingService.getGatewayUrl()}/${this.prefix}/roles/${role.id}`, role);
  }

  public patchUserRole(role: UserRole): Observable<UserRole> {
    return this.httpClient.patch<UserRole>(`${this.settingService.getGatewayUrl()}/${this.prefix}/roles/${role.id}`, role);
  }

  public deleteUserRole(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.settingService.getGatewayUrl()}/${this.prefix}/roles/${id}`);
  }

  //Routes
  public getRoutes(): Observable<Route[]> {
    return this.httpClient.get<Route[]>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes`);
  }

  public getRoute(id: number): Observable<Route> {
    return this.httpClient.get<Route>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes/${id}`);
  }

  public postRoute(route: Route): Observable<Route> {
    return this.httpClient.post<Route>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes`, route);
  }

  public putRoute(route: Route): Observable<Route> {
    return this.httpClient.put<Route>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes/${route.id}`, route);
  }

  public patchRoute(route: Route): Observable<Route> {
    return this.httpClient.patch<Route>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes/${route.id}`, route);
  }

  public deleteRoute(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.settingService.getGatewayUrl()}/${this.prefix}/routes/${id}`);
  }
}
