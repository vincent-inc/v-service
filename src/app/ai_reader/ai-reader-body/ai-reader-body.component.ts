import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AiReaderService } from '../ai-reader.service';
import { SettingService } from 'src/app/shared/service/Setting.service';
import { NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-ai-reader-body',
  templateUrl: './ai-reader-body.component.html',
  styleUrls: ['./ai-reader-body.component.scss']
})
export class AiReaderBodyComponent implements OnInit {
  
  constructor(
    public aiReaderService: AiReaderService, 
    private pdfViewerService: NgxExtendedPdfViewerService, 
    private settingService: SettingService) { }

  ngOnInit() {
    this.aiReaderService.pdfViewerService = this.pdfViewerService;
    pdfDefaultOptions.textLayerMode = this.pdfViewerService ? 2 : 1;
    this.settingService.currentMenu = 'ai-menu';
  }
}
