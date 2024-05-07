import { Component, forwardRef } from '@angular/core';
import { SideDrawerMenuComponent } from 'src/app/side-drawer/side-drawer-menu/side-drawer-menu.component';
import { AiReaderService } from '../ai-reader.service';
import { UtilsService } from 'src/app/shared/service/Utils.service';
import { RaphaelTTSServiceV1 } from 'src/app/shared/service/Raphael.service';

@Component({
  selector: 'app-side-drawer-ai-reader',
  templateUrl: './side-drawer-ai-reader.component.html',
  styleUrls: ['./side-drawer-ai-reader.component.scss'],
  providers: [{provide: SideDrawerMenuComponent, useExisting: forwardRef(() => SideDrawerAiReaderComponent)}],
})
export class SideDrawerAiReaderComponent extends SideDrawerMenuComponent {

  loadUrl: string = '';
  
  constructor(public aiReaderService: AiReaderService, private utilService: UtilsService, private raphaelTTSService: RaphaelTTSServiceV1) {
    super();
  }

  override ngOnInit(): void {
      
  }

  loadFromUrl() {
    this.raphaelTTSService.fetchFromUrl(this.loadUrl).subscribe(
      res => {
        let url = URL.createObjectURL(res.body!);
        this.aiReaderService.loadedSrc = url;
      }
    );
  }

  loadFromLocal() {
    this.utilService.uploadFile(".pdf").then(file => {
      let url = URL.createObjectURL(file.rawFile!);
      this.aiReaderService.loadedSrc = url;
    }).catch() 
  }
}
