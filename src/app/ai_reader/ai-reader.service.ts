import { Injectable } from '@angular/core';
import { NgxExtendedPdfViewerService, TextLayerRenderedEvent} from 'ngx-extended-pdf-viewer';
import { UtilsService } from '../shared/service/Utils.service';
import { AIReaderService } from '../shared/service/AI.service';
import { RaphaelTTSService } from '../shared/service/Raphael.service';
import { TTS } from '../shared/model/AI.model';

export class Speak {
  sentence: string = '';
  ttsId?: number;
  span?: HTMLSpanElement;
  page: number | null = null;
  row: number | null = null;
  objectUrl: string | null = null;
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

  maxPreloadQueue = 5;

  constructor(private raphaelTTSService: RaphaelTTSService) { 
    
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
      sentence = sentence.trim();
      sentence = sentence.replaceAll("&", "and");
      sentence = sentence.replaceAll("=", "equal");
      let speak: Speak = new Speak();
      speak.sentence = sentence;
      speak.span = span;
      speak.page = +page!;
      speak.row = row;
      span.addEventListener("mouseover", (event) => span.classList.add('greenHightLight'));
      span.addEventListener("mouseleave", (event) => span.classList.remove('greenHightLight'));
      span.addEventListener("click", async event => await this.onLineClick(+page!, row));
      this.setTable(+page!, row, speak);

      if(sentence) {
        UtilsService.ObservableToPromise(this.raphaelTTSService.post({text: sentence})).then(res => {
          let it = this.getTable(+page!, row);
          it.ttsId = res.id;
        }).catch(error => console.log(error));
      }
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

  foreachSpeak(fn: (s: Speak) => void) {
    this.table.forEach(page => {
      page.forEach(speak => fn(speak));
    })
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

  async playSpeak(speak: Speak): Promise<void> {
    return new Promise<void>((resolve) => {
      this.tts.onended = () => resolve();

      if(this.isValidSpeak(speak) && (speak.objectUrl || (speak.sentence && speak.ttsId))) {
        if(speak.objectUrl)
          this.tts.src = speak.objectUrl;
        else 
          this.tts.src = this.raphaelTTSService.generateSpeakWavLinkWithId(speak.ttsId!);

        this.tts.play().then().catch(er => {});
      }
      else
        resolve();
    })
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

  async previousSpeak() {
    if(!this.selectedSpeak) {
      this.selectedSpeak = this.getTable(this.pdfViewerService.getCurrentlyVisiblePageNumbers()[0], 0);

      if(this.playSpeakOnSelect)
        await this.playSpeak(this.selectedSpeak);
      return;
    }

    this.selectSpeak(this.getPreviousFromSpeak(this.selectedSpeak)!);

    if(this.playSpeakOnSelect)
      await this.playSpeak(this.selectedSpeak);
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

  async nextSpeak() {
    if(!this.selectedSpeak) {
      this.selectedSpeak = this.getTable(this.pdfViewerService.getCurrentlyVisiblePageNumbers()[0], 0);

      if(this.playSpeakOnSelect)
        await this.playSpeak(this.selectedSpeak);
      return;
    }

    this.selectSpeak(this.getNextFromSpeak(this.selectedSpeak)!);

    if(this.playSpeakOnSelect)
      await this.playSpeak(this.selectedSpeak);
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

  async nowPlayReading() {
    if(!this.selectedSpeak) {
      this.selectedSpeak = this.getTable(this.pdfViewerService.getCurrentlyVisiblePageNumbers()[0], 0);
    }

    this.playReading = !this.playReading;

    if(!this.playReading) {
      this.tts.pause();
      return;
    }

    this.foreachSpeak(e => {
      if(e.objectUrl) {
        URL.revokeObjectURL(e.objectUrl);
        e.objectUrl = null;
      }
    });
    
    this.playSpeakOnSelect = true;
    await this.beginPlayReading();
  }

  private preloadAudio(): Promise<void> {
    return new Promise<void>(async resolve => {
      if(!this.selectedSpeak) {
        this.selectedSpeak = this.getTable(this.pdfViewerService.getCurrentlyVisiblePageNumbers()[0], 0);
      }
  
      let currentSpeak = this.getNextFromSpeak(this.selectedSpeak);
      if(!currentSpeak)
        resolve();

      for(let i = 0; i < this.maxPreloadQueue; i ++) {
        if (this.isValidSpeak(currentSpeak!) && currentSpeak!.sentence && currentSpeak!.ttsId) {
          if(currentSpeak!.objectUrl) {
            this.raphaelTTSService.checkValidUrl(currentSpeak!.objectUrl).then().catch(() => {
              this.preload(currentSpeak?.page!, currentSpeak?.row!);
            });
          }
          else 
            this.preload(currentSpeak?.page!, currentSpeak?.row!);
        }
        
        currentSpeak = this.getNextFromSpeak(currentSpeak!);
        if(!currentSpeak)
          break;
      }

      resolve();
    })
  }

  private preload(page: number, row: number) {
    let speak = this.getTable(page, row);
    this.raphaelTTSService.getWavById(speak.ttsId!).then(wav => {
      let url = URL.createObjectURL(wav.body!);
      let speak = this.getTable(page, row);
      speak.objectUrl = url;
    });
  }

  private async beginPlayReading() {
    this.preloadAudio().then().catch();
    await this.playSpeak(this.selectedSpeak!);
    if(this.playReading) {
      let next = this.getNextFromSpeak(this.selectedSpeak!);
      while(next && !next.sentence)
        next = this.getNextFromSpeak(next);

      if(!next) {
        this.playReading = false;
        return;
      }
      
      this.selectSpeak(next);
      this.beginPlayReading();
    }
  }
  
}
