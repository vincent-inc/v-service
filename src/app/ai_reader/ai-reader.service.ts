import { Injectable } from '@angular/core';
import { NgxExtendedPdfViewerService, TextLayerRenderedEvent} from 'ngx-extended-pdf-viewer';
import { UtilsService } from '../shared/service/Utils.service';
import { AIReaderService } from '../shared/service/AI.service';

export class Speak {
  sentence: string = '';
  blob?: Blob;
  objectUrl?: string;
  span?: HTMLSpanElement;
  page: number | null = null;
  row: number | null = null;
}

@Injectable({
  providedIn: 'root'
})
export class AiReaderService {

  pdfViewerService!: NgxExtendedPdfViewerService;

  extractedText: string | undefined;

  extractedLines: Array<string> = [];

  showToolBar = true;

  table: Speak[][] = [[]];

  selectedSpeak?: Speak | null;

  playReading: boolean = false;

  playSpeakOnSelect: boolean = false;

  tts = new Audio();

  constructor(private AIReaderService: AIReaderService) { 
    
  }

  onPageChange(pageNumber: number) {
    //do something on page change
  }

  onTextLayerRendered(event: TextLayerRenderedEvent) {
    let div = event.source.div;
    let page = div.getAttribute('data-page-number');
    let textLayerDiv = div.getElementsByClassName('textLayer')[0] as HTMLDivElement;
    let spans = textLayerDiv.getElementsByTagName("span");

    for (let row = 0; row < spans.length; row++) {
      let span = spans[row] as HTMLSpanElement;
      let sentence = span.innerText;
      sentence = sentence.replaceAll("&", "and");
      sentence = sentence.replaceAll("=", "equal");
      let speak: Speak = new Speak();
      speak.sentence = sentence;
      speak.span = span;
      speak.page = +page!;
      speak.row = row;
      span.addEventListener("mouseover", (event) => span.classList.add('greenHightLight'));
      span.addEventListener("mouseleave", (event) => span.classList.remove('greenHightLight'));
      span.addEventListener("click", event => this.onLineClick(+page!, row));
      this.setTable(+page!, row, speak);

      // speak.tts.src = this.AIReaderService.generateSpeakWavLink(sentence);
      // new Promise<void>(resolve => {
      //   console.log("Loading wav for: " + speak.tts.src);
      //   speak.tts.load();
      //   resolve();
      // }).then(() => console.log("Finish loading wav for: " + speak.tts.src));
      
      UtilsService.ObservableToPromise(this.AIReaderService.postSpeakWav(sentence)).then(res => {
        let it = this.getTable(+page!, row);
        it.blob = res.body!;
        it.objectUrl = window.URL.createObjectURL(it.blob);
      }).catch(error => console.log(error));

      // this.AIReaderService.generateSpeakWav(sentence).subscribe(
      //   res => {
      //     let it = this.getTable(+page!, row);
      //     it.tts = res;
      //     console.log(it);
      //     console.log(res);
      //   },
      //   error => {},
      //   () => {console.log("finish")}
      // )
    }
  }

  onLineClick(page: number, row: number) {
    let speak = this.table[page][row];
    this.selectSpeak(speak);
    if(this.playSpeakOnSelect)
      this.playSpeak(this.selectedSpeak!);
  }

  private autoCorrectTable(page: number, row: number) {
    while(this.table.length <= page)
      this.table.push([]);

    while(this.table[page].length <= row)
      this.table[page].push(new Speak());
  }

  isValidSpeak(speak: Speak): boolean {
    return speak && speak.page !== null && speak.row !== null && speak.page >= 0 && speak.row >= 0;
  }

  setTable(page: number, row: number, speak: Speak) {
    this.autoCorrectTable(page, row);
    this.table[page][row] = speak;
  }

  getTable(page: number, row: number): Speak {
    this.autoCorrectTable(page, row);
    return this.table[page][row];
  }

  selectSpeak(speak: Speak) {
    if(!this.selectedSpeak)
      this.selectedSpeak = speak;

    this.selectedSpeak!.span!.classList.remove('blueGreenHightLight');
    this.selectedSpeak = speak;
    this.selectedSpeak!.span!.classList.add('blueGreenHightLight');
  }

  playSpeak(speak: Speak): HTMLAudioElement | null {
    if(this.isValidSpeak(speak) && speak.blob) {
      if(!speak.objectUrl)
        speak.objectUrl = window.URL.createObjectURL(speak.blob);

      this.tts.src = speak.objectUrl;
      this.tts.load();
      this.tts.play();
      return this.tts;
    }

    return null;
  }

  getPrevious(page: number, row: number): Speak {
    let currentSpeak = this.getTable(page, row);

    row--;
    let previous = this.getTable(page, row);
    if(this.isValidSpeak(previous))
      return previous;
    
    page--;
    row = 0;
    previous = this.getTable(page, row);

    if(!this.isValidSpeak(previous))
      return currentSpeak;
    else
      return previous;
  }

  getPreviousFromSpeak(speak: Speak): Speak | null {
    let page = speak.page;
    let row = speak.row;

    if(!this.isValidSpeak(speak))
      return null;
    
    return this.getPrevious(page!, row!);
  }

  previousSpeak() {
    if(!this.selectedSpeak) {
      this.selectedSpeak = this.getTable(this.pdfViewerService.getCurrentlyVisiblePageNumbers()[0], 0);
      return;
    }

    this.selectSpeak(this.getPreviousFromSpeak(this.selectedSpeak)!);
  }

  getNext(page: number, row: number): Speak {
    let currentSpeak = this.getTable(page, row);

    row++;
    let next = this.getTable(page, row);
    if(this.isValidSpeak(next))
      return next;
    
    page++;
    row = 0;
    next = this.getTable(page, row);

    if(!this.isValidSpeak(next))
      return currentSpeak;
    else
      return next;
  }

  getNextFromSpeak(speak: Speak): Speak | null {
    let page = speak.page;
    let row = speak.row;

    if(!this.isValidSpeak(speak))
      return null;
    
    return this.getNext(page!, row!);
  }

  nextSpeak() {
    if(!this.selectedSpeak) {
      this.selectedSpeak = this.getTable(this.pdfViewerService.getCurrentlyVisiblePageNumbers()[0], 0);
      return;
    }

    this.selectSpeak(this.getNextFromSpeak(this.selectedSpeak)!);
  }

  nextPage() {
    this.pdfViewerService.scrollPageIntoView(3);
  }

  async exportAsText(): Promise<void> {
    this.extractedLines = [];
    this.extractedText = await this.pdfViewerService.getPageAsText(1);
  }
  
  async exportAsLines(): Promise<void> {
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

  doMarkSentenceClassInBox(span: HTMLSpanElement, sentence: string): void {
    if(span.innerText.toLowerCase().includes(sentence.toLowerCase()))
      span.classList.add('box');
  }

  nowPlayReading() {
    this.playReading = !this.playReading;
    this.beginPlayReading();
  }

  async beginPlayReading() {
    return new Promise<void>((resolve) => {
      if(!this.playReading)
        resolve();
      
      if(!this.selectedSpeak)
        this.selectedSpeak = this.getTable(this.pdfViewerService.getCurrentlyVisiblePageNumbers()[0], 0);
      
      if(this.selectedSpeak && this.selectedSpeak.span) {
        this.selectedSpeak.span.classList.add('blueGreenHightLight');
        setTimeout(() => {
          this.selectedSpeak!.span!.classList.remove('blueGreenHightLight');
          let next = this.getNextFromSpeak(this.selectedSpeak!);
          if(next) {
            this.selectedSpeak = next;
            this.beginPlayReading();
          }
        }, 1000);
      }
    });
  }
  
}
