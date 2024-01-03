import { Component, OnInit, forwardRef } from '@angular/core';
import { SideDrawerMenuComponent } from 'src/app/side-drawer/side-drawer-menu/side-drawer-menu.component';

@Component({
  selector: 'app-side-drawer-ai-reader',
  templateUrl: './side-drawer-ai-reader.component.html',
  styleUrls: ['./side-drawer-ai-reader.component.scss'],
  providers: [{provide: SideDrawerMenuComponent, useExisting: forwardRef(() => SideDrawerAiReaderComponent)}],
})
export class SideDrawerAiReaderComponent extends SideDrawerMenuComponent {

  constructor() {
    super();
  }

}
