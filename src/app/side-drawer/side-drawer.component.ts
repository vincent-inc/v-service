import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticatorService } from '../shared/service/Authenticator.service';

@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.scss']
})
export class SideDrawerComponent implements OnInit {

  currentMenu = "main";

  constructor() { }

  ngOnInit() {
    
  }

  changeMenu(menu: string) {
    this.currentMenu = menu;
  }
}