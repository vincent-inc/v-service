import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticatorService } from '../shared/service/Authenticator.service';
import { SettingService } from '../shared/service/Setting.service';

@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.scss']
})
export class SideDrawerComponent implements OnInit {

  constructor(public settingService: SettingService) { }

  ngOnInit() {
    
  }

  changeMenu(menu: string) {
    this.settingService.currentMenu = menu;
  }
}