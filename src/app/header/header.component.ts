import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthenticatorService } from '../shared/service/Authenticator.service';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  drawer?: MatDrawer;

  constructor(public authenticatorService: AuthenticatorService, private router: Router) { }

  ngOnInit() {
    this.authenticatorService.isLoginCallWithReroute();
  }

  logout(): void {
    this.authenticatorService.logout();
  }

  getURL(): string {
    return document.URL;
  }
  
}
