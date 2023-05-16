import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  rightDomain = 'https://vincentprivate.synology.me:10780';

  constructor() { }

  ngOnInit() {

  }

  getRightDomain() {
    return this.rightDomain + '/home'
  }

  isInWrongURL(): boolean {
    let url = this.getURL();
    if(url.includes(this.rightDomain))
      return false;
    return true;
  }

  getURL(): string {
    return document.URL;
  }

}
