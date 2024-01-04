import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AiReaderService } from '../ai-reader.service';

@Component({
  selector: 'app-ai-reader-body',
  templateUrl: './ai-reader-body.component.html',
  styleUrls: ['./ai-reader-body.component.scss']
})
export class AiReaderBodyComponent implements OnInit, AfterViewInit {
  
  constructor(public aiReaderService: AiReaderService) { 
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    
  }
}
