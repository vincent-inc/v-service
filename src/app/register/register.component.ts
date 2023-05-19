import { AfterContentChecked, AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthenticatorService } from '../shared/service/Authenticator.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../shared/model/Authenticator.model';
import { first } from 'rxjs';
import { ConfirmDialog } from '../shared/dialog/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterContentChecked {

  username: string = ''
  usernameError: string = '';

  password: string = ''

  alias: string = ''

  validForm: boolean = false;

  error: string = "";

  constructor(
    private authenticatorService: AuthenticatorService, 
    private matDialog: MatDialog, 
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
  }

  async register(): Promise<void> {
    if(!this.validForm)
      return;

    let user: User = {
      username: this.username,
      password: this.password,
      userProfile: {
        alias: this.alias
      },
      enable: true
    }

    let isExist = await this.isUsernameValid(this.username);
    if(isExist) {
      this.error = "Username already Exist";
      return;
    }
    else
      this.error = "";

    this.authenticatorService.postUser(user).pipe(first()).subscribe(
      res => {
        let dialog = this.matDialog.open(ConfirmDialog, {data: {title: "Register Successful", message: "Do you want to auto login with registered information?\nAnd redirect to home?"}});
      
        dialog.afterClosed().pipe(first()).subscribe(
          res => {
            this.login({username: this.username, password: this.password});
          },
          error => {}
        );
      },
      error => {}
    );
  }

  login(user: {username: string, password: string}): void
  {
    this.authenticatorService.login(user).pipe(first()).subscribe(
      async res => {
        await this.authenticatorService.autoUpdateUserWithJwt(res.jwt!); 
        this.router.navigate(['home'])
      },
      error => {this.error = 'invalid or wrong username or password'}
    );
  }

  async isUsernameValid(username: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.authenticatorService.isUsernameExist(username).pipe(first()).subscribe(
        res => {
          resolve("");
        },
        error => {reject("username already exist")}
      )
    });
  }

  validateUsernameFn(): void {
    if(!this.username)
      return;

    this.authenticatorService.isUsernameExist(this.username).pipe(first()).subscribe(
      res => {
        this.usernameError = res.exist ? "Username already exist" : "";
      },
      error => {}
    );
  }
}
