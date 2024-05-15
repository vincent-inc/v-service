import { Component, OnInit } from '@angular/core';
import { OpenIdService } from '../shared/service/OpenId.service';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../shared/service/Authenticator.service';
import { OpenIdRequest } from '../shared/model/Authenticator.model';
import { first } from 'rxjs';

@Component({
  selector: 'app-openId',
  templateUrl: './openId.component.html',
  styleUrls: ['./openId.component.scss']
})
export class OpenIdComponent implements OnInit {

  error = '';

  constructor(private openIdService: OpenIdService, private authenticatorService: AuthenticatorService, private router: Router) { }

  ngOnInit() {
    let queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let code = urlParams.get("code");
    let state = urlParams.get("state");
    let redirectUri = this.openIdService.getRedirectUri();

    if(code && state) {
      let openIdRequest: OpenIdRequest = {
        code: code,
        state: state,
        redirectUri: redirectUri
      }
      this.loginWithOpenId(openIdRequest);
    }
    else
      this.error = "Can't login to Viescloud service, Please try again latter";
  }

  loginWithOpenId(openIdRequest: OpenIdRequest)
  {
    this.authenticatorService.loginWithOpenId(openIdRequest).pipe(first()).subscribe(
      async res => {
        await this.authenticatorService.autoUpdateUserWithJwt(res.jwt!); 
        this.router.navigate(['home'])
      },
      error => {
        this.error = error.error.message;
      }
    );
  }

}
