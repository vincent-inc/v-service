import { Component, EventEmitter, OnInit, Output, forwardRef } from '@angular/core';
import { AuthenticatorService } from 'src/app/shared/service/Authenticator.service';
import { SideDrawerMenuComponent } from '../side-drawer-menu/side-drawer-menu.component';
import { SettingService } from 'src/app/shared/service/Setting.service';

@Component({
  selector: 'app-side-drawer-main-menu',
  templateUrl: './side-drawer-main-menu.component.html',
  styleUrls: ['./side-drawer-main-menu.component.scss'],
  providers: [{provide: SideDrawerMenuComponent, useExisting: forwardRef(() => SideDrawerMainMenuComponent)}],
})
export class SideDrawerMainMenuComponent extends SideDrawerMenuComponent {

  constructor(public authenticatorService: AuthenticatorService, public settingService: SettingService) {
    super();
  }

  override ngOnInit() {

  }
}
