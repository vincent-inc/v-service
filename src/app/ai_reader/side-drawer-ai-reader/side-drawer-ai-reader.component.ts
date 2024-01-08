import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { SideDrawerMenuComponent } from 'src/app/side-drawer/side-drawer-menu/side-drawer-menu.component';
import { AiReaderService } from '../ai-reader.service';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-side-drawer-ai-reader',
  templateUrl: './side-drawer-ai-reader.component.html',
  styleUrls: ['./side-drawer-ai-reader.component.scss'],
  providers: [{provide: SideDrawerMenuComponent, useExisting: forwardRef(() => SideDrawerAiReaderComponent)}],
})
export class SideDrawerAiReaderComponent extends SideDrawerMenuComponent {

  constructor(public aiReaderService: AiReaderService) {
    super();
  }

  override ngOnInit(): void {
      
  }
}
