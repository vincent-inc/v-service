import { Injectable } from '@angular/core';
import { NgxExtendedPdfViewerService, TextLayerRenderedEvent} from 'ngx-extended-pdf-viewer';

export class SpeakMap {
  speak: Speak[] = [];
}

export class Speak {
  sentence: string = '';
  tts?: File;
}

@Injectable({
  providedIn: 'root'
})
export class AiReaderService {

  pdfViewerService!: NgxExtendedPdfViewerService;

  extractedText: string | undefined;

  extractedLines: Array<string> = [];

  showToolBar = true;

  speakMap: SpeakMap[] = [];

  playReading: boolean = false;

  constructor() { 
    
  }

  onPageChange(pageNumber: number) {
    //do something on page change
  }

  onTextLayerRendered(event: TextLayerRenderedEvent) {
    let div = event.source.div;
    let pageNumber = div.getAttribute('data-page-number');

    if(!this.speakMap[+pageNumber!])
      this.speakMap[+pageNumber!] = new SpeakMap();

    let textLayerDiv = div.getElementsByClassName('textLayer')[0] as HTMLDivElement;
    let spans = textLayerDiv.getElementsByTagName("span");
    for (let sentenceIndex = 0; sentenceIndex < spans.length; sentenceIndex++) {
      let span = spans[sentenceIndex] as HTMLSpanElement;
      let sentence = span.innerText;
      let map = this.speakMap[+pageNumber!];
      let speak = new Speak();
      speak.sentence = sentence;
      //todo call BE to get TTS here

      //update sentence only if not found
      if(!map.speak[sentenceIndex])
        map.speak[sentenceIndex] = speak;
    }
  }

  public getMaxPage() {
  }

  public nextPage() {
    this.pdfViewerService.scrollPageIntoView(3);
  }

  public async exportAsText(): Promise<void> {
    this.extractedLines = [];
    this.extractedText = await this.pdfViewerService.getPageAsText(1);
  }
  
  public async exportAsLines(): Promise<void> {
    let page = this.pdfViewerService.getCurrentlyVisiblePageNumbers();
    const lines = await this.pdfViewerService.getPageAsLines(page[0]);
    this.extractedText = undefined;
    this.extractedLines = lines.map(line => line.text);
    console.log(lines);
  }

  private boxSentences(div: HTMLDivElement, sentence: string, targetPageNumber?: number) {
    let pageNumber = div.getAttribute('data-page-number');
    if(!targetPageNumber || (pageNumber && targetPageNumber && +pageNumber === targetPageNumber)) {
      let textLayerDiv = div.getElementsByClassName('textLayer')[0] as HTMLDivElement;
      let spans = textLayerDiv.getElementsByTagName("span");
      for (let i = 0; i < spans.length; i++) {
        let span = spans[i] as HTMLSpanElement;
        this.doMarkSentenceClassInBox(span, sentence);
      }
    }
  }

  public doMarkSentenceClassInBox(span: HTMLSpanElement, sentence: string): void {
    if(span.innerText.toLowerCase().includes(sentence.toLowerCase()))
      span.classList.add('box');
  }
}
