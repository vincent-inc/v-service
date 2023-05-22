import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-mat-form-field-text-area',
  templateUrl: './mat-form-field-text-area.component.html',
  styleUrls: ['./mat-form-field-text-area.component.scss']
})
export class MatFormFieldTextAreaComponent implements OnInit {

  @Input()
  value: string | number = '';

  valueCopy: string | number = '';

  @Output()
  valueOutput: EventEmitter<string | number> = new EventEmitter();

  @Output()
  onValueChange: EventEmitter<void> = new EventEmitter();

  @Output()
  onEnter: EventEmitter<void> = new EventEmitter();

  @Input()
  maxlength: string = '';

  @Input()
  error: string = '';

  @Input()
  placeholder: string = '';

  @Input()
  appearance: string = 'fill';

  @Input()
  matColor: ThemePalette = 'primary';

  @Input()
  width: number = 40;

  @Input()
  label: string = '';

  @Input()
  styleWidth?: string;

  @Input()
  required: boolean = false;

  @Input()
  autoResize: boolean = false;

  @Input()
  autoResizeHeight: boolean = true;

  @Input()
  disable: boolean = false;

  @Input()
  showGoto: boolean = false;

  @Input()
  showClearIcon: boolean = true;

  @Input()
  showEnterIcon: boolean = false;

  @Input()
  showCopyToClipboard: boolean = false;

  @Input()
  showGenerateValue: boolean = false;

  @Input()
  alwayUppercase: boolean = false;

  @Input()
  alwayLowercase: boolean = false;

  @Input()
  manuallyEmitValue: boolean = false;

  //input copy
  @Input()
  copyDisplayMessage: string = this.value.toString();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.valueCopy = structuredClone(this.value);
  }

  emitValue(): void {
    let value = this.value;

    if (this.alwayLowercase && typeof value === 'string')
      value = value.toLowerCase();

    if (this.alwayUppercase && typeof value === 'string')
      value = value.toUpperCase();

    this.valueOutput.emit(value);
    this.onValueChange.emit();
  }

  emitValueWithCondition(): void {
    if(this.manuallyEmitValue)
      return;

    this.emitValue();
  }

  clear(): void {
    this.value = ''

    if(this.manuallyEmitValue)
      return;
      
    this.valueOutput.emit(this.value);
  }

  getSize(data: string): number {
    let offset = 10;
    if (this.showCopyToClipboard)
      offset += 5;
    if (this.showGenerateValue)
      offset += 5;
    if (this.showGoto)
      offset += 5;

    if (!this.autoResize)
      return this.width;

    if (data.length <= 10)
      return this.width;
    else
      return data.length + offset;
  }

  getAppearance(): MatFormFieldAppearance {
    let appearance: MatFormFieldAppearance = 'fill';
    switch (this.appearance.toLowerCase()) {
      case 'fill':
      case '1':
        appearance = 'fill'
        break;

      case 'outline':
      case '2':
        appearance = 'outline'
        break;

      default:
        break;
    }

    return appearance;
  }

  openLink(link: string): void {
    window.open(link);
  }

  isValidInput(): boolean {
    if (this.required && this.value === '')
      return false;

    if (this.error)
      return false;

    return true;
  }

  isValueChange(): boolean {
    return this.value !== this.valueCopy;
  }

  isValueNotChange(): boolean {
    return this.value === this.valueCopy;
  }

  isValueString(): boolean {
    return typeof this.value === 'string';
  }

}
