import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/shared/service/Setting.service';

@Component({
  selector: 'app-vincent',
  templateUrl: './vincent.component.html',
  styleUrls: ['./vincent.component.scss']
})
export class VincentComponent implements OnInit, OnDestroy {

  constructor(
    private settingService: SettingService,
    private router: Router
  ) { }

  ngOnInit() {
    let urls = this.router.url.split('/');

    if(urls.some(u => u === 'iframe'))
      this.settingService.setDisplayHeader(false);
  }

  ngOnDestroy(): void {
    this.settingService.setDisplayHeader(true);
  }

}
