import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthenticatorService } from '../shared/service/Authenticator.service';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../shared/service/Setting.service';
import { OpenIdService } from '../shared/service/OpenId.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  drawer?: MatDrawer;

  constructor(
    public openIdService: OpenIdService,
    public authenticatorService: AuthenticatorService, 
    private router: Router,
    private settingService: SettingService
    ) { }

  ngOnInit() {
    this.drawer?.toggle();
    this.authenticatorService.isLoginCall();
  }

  logout(): void {
    this.authenticatorService.logout();
  }

  getURL(): string {
    return document.URL;
  }

  getAlias(): string {
    if(this.authenticatorService.currentUser?.name)
      return this.authenticatorService.currentUser?.name;
    else if(this.authenticatorService.currentUser?.userProfile?.alias)
      return this.authenticatorService.currentUser?.userProfile?.alias;
    else if(this.authenticatorService.currentUser?.userProfile?.firstName && this.authenticatorService.currentUser?.userProfile?.lastName)
      return `${this.authenticatorService.currentUser?.userProfile?.firstName} ${this.authenticatorService.currentUser?.userProfile?.lastName}`
    else 
      return ""
  }

  getDisplayHeader(): boolean {
    let display = this.settingService.getDisplayHeader();
    if (!display)
      this.drawer?.close();
    return display;
  }
}
