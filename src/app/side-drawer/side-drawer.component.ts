import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../shared/service/Authenticator.service';

@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.scss']
})
export class SideDrawerComponent implements OnInit {

  constructor(public authenticatorService: AuthenticatorService) { }

  ngOnInit() {
    
  }

}
