import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  apiGatewayUrl: string = environment.gateway_api;

  constructor(private httpClient: HttpClient, private router: Router) { }

  getGatewayUrl(): string {
    return this.apiGatewayUrl;
  }

}
