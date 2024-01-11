import { Injectable } from '@angular/core';
import { NgxExtendedPdfViewerService, TextLayerRenderedEvent} from 'ngx-extended-pdf-viewer';
import { UtilsService } from '../shared/service/Utils.service';
import { AIReaderService } from '../shared/service/AI.service';
import { RaphaelTTSService } from '../shared/service/Raphael.service';
import { TTS } from '../shared/model/AI.model';

export class Speak {
  sentence: string = '';
  ttsId?: number;
  page: number | null = null;
  row: number | null = null;
  objectUrl: string | null = null;
  elements: HTMLElement[] = [];
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

  mouseOverColor = "green";

  autoSpeakColor = "blue";

  constructor(private raphaelTTSService: RaphaelTTSService) { 
    
  }

  onPageChange(pageNumber: number) {
    //do something on page change
  }

  onTextLayerRendered(event: TextLayerRenderedEvent) {
    let codeElement = "a";
    let div = event.source.div;
    let page = div.getAttribute('data-page-number');
    let textLayerDiv = div.getElementsByClassName('textLayer')[0] as HTMLDivElement;
    let spans = textLayerDiv.getElementsByTagName("span");
    let newLine = true;

    let speak: Speak = new Speak();
    let elementRow = 0;
    for (let row = 0; row < spans.length; row++) {
      let span = spans[row] as HTMLSpanElement;

      if(span.getElementsByTagName(codeElement).length > 0)
        continue;

      let sentence = structuredClone(span.innerText);
      sentence = sentence.trim();
      sentence = sentence.replaceAll("&", "and");
      sentence = sentence.replaceAll("=", "equal");
      span.innerText = "";
      
      // span.innerText = `<span style="color: red;>${span.innerText}</span>`
      
      let splitTexts = sentence.match(/(?=[^])(?:\P{Sentence_Terminal}|\p{Sentence_Terminal}(?!['"`\p{Close_Punctuation}\p{Final_Punctuation}\s]))*(?:\p{Sentence_Terminal}+['"`\p{Close_Punctuation}\p{Final_Punctuation}]*|$)/guy);
      if(splitTexts) {

        for(let i = 0; i < splitTexts.length; i++) {
          let text = splitTexts[i];
          if(newLine) {
            newLine = false;
            if(!speak.sentence) {
              speak.sentence = text;
              speak.page = +page!;
              speak.row = elementRow;
              elementRow++;
            }
            else if(this.isFirstCharUppercase(text)) {
              speak = new Speak();
              speak.sentence = text;
              speak.page = +page!;
              speak.row = elementRow;
              elementRow++;
            }
            else {
              speak.sentence += " " + text;
            }
          }
          else {
            speak = new Speak();
            speak.sentence = text;
            speak.page = +page!;
            speak.row = elementRow;
            elementRow++;
          }

          if(!this.isValidSpeak(speak)){
            throw Error("something when wrong ");
          }

          this.addCodeElement(text, span, codeElement, speak);
          this.setTable(speak.page!, speak.row!, speak);
          
        }
      }

      newLine = true;
    }

    this.foreachSpeak(s => {
      UtilsService.ObservableToPromise(this.raphaelTTSService.post({text: s.sentence})).then(res => {
        let page = s.page;
        let row = s.row;
        let it = this.getTable(page!, row!);
        it.ttsId = res.id;
      }).catch(error => console.log(error));
    })
  }

  private isFirstCharUppercase(text: string): boolean {
    let firstChar = text.substring(0, 1);
    return firstChar === firstChar.toUpperCase();
  }

  private addCodeElement(text: string, span: HTMLSpanElement, element: string, speak: Speak) {
    let codeElement = document.createElement(element);
    if(text.trim()) {
      codeElement.addEventListener("mouseover", (event) => this.changeSpeakBackgroundColorLocation(speak.page!, speak.row!, this.mouseOverColor, this.autoSpeakColor));
      codeElement.addEventListener("mouseleave", (event) => this.changeSpeakBackgroundColorLocation(speak.page!, speak.row!, "", this.autoSpeakColor));
      codeElement.addEventListener("click", async event => await this.onLineClick(speak.page!, speak.row!));
    }
    codeElement.innerText = text;
    codeElement.style.cssText = span.style.cssText;
    // codeElement.style.transform = "";
    // codeElement.style.color = "red";
    speak.elements.push(codeElement);
    span.appendChild(codeElement);
  }

  changeSpeakBackgroundColor(speak: Speak, color: string, skipIfColor?: string) {
    if(this.isValidSpeak(speak)) {
      speak.elements.forEach(e => {
        if(!(skipIfColor && e.style.backgroundColor === skipIfColor))
          e.style.backgroundColor = color
      });
    }
  }

  changeSpeakBackgroundColorLocation(page: number, row: number, color: string, skipIfColor?: string) {
    let speak = this.getTable(page, row);
    this.changeSpeakBackgroundColor(speak, color, skipIfColor);
  }

  onLineClick(page: number, row: number) {
    let speak = this.table[page][row];
    this.selectSpeak(speak);
    if(this.playSpeakOnSelect)
      this.playSpeak(this.selectedSpeak!);
  }

  foreachSpeak(fn: (s: Speak) => void) {
    this.table.forEach(page => {
      page.forEach(speak => fn(speak));
    })
  }

  isValidSpeak(speak: Speak): boolean {
    return speak && speak.page !== null && speak.row !== null && speak.page >= 0 && speak.row >= 0;
  }

  private autoCorrectTable(page: number, row: number) {
    while(this.table.length <= page)
      this.table.push([]);

    while(this.table[page].length <= row)
      this.table[page].push(new Speak());
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

    this.changeSpeakBackgroundColor(this.selectedSpeak!, "");
    this.selectedSpeak = speak;
    this.changeSpeakBackgroundColor(this.selectedSpeak!, this.autoSpeakColor);
  }

  clearSelectedSpeak() {
    if(this.selectedSpeak) {
      this.changeSpeakBackgroundColor(this.selectedSpeak!, "");
      this.selectedSpeak = null;
    }
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
