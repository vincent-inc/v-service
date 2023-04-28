import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username: string = ''
  usernameValid: boolean = false;

  password: string = ''
  passwordValid: boolean = false;

  constructor() { }

  ngOnInit() {
  }
  
}
