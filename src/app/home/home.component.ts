import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  isInWrongURL(): boolean {
    return this.getURL().includes("https://vincentprivate.synology.me");
  }

  getURL(): string {
    return document.URL;
  }

}
