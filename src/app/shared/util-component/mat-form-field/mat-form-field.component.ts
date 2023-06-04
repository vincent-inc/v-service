import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-mat-form-field',
  templateUrl: './mat-form-field.component.html',
  styleUrls: ['./mat-form-field.component.scss']
})
export class MatFormFieldComponent implements OnInit, OnChanges {

  @Input()
  value: string | number | any = '';

  valueCopy: string | number | any = '';

  @Output()
  valueOutput: EventEmitter<string | number | any> = new EventEmitter();

  @Output()
  onValueChange: EventEmitter<void> = new EventEmitter();

  @Output()
  onEnter: EventEmitter<void> = new EventEmitter();

  @Input()
  error: string = '';

  internalError = '';

  @Input()
  label: string = '';

  @Input()
  required: boolean = false;

  @Input()
  disable: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.valueCopy = structuredClone(this.value);
  }

  emitValue(): void {
    this.valueOutput.emit(this.value);
    this.onValueChange.emit();
  }

  emitEnter(): void {
    this.onEnter.emit();
  }

  clear(): void {
    if (this.isValueNumber())
      this.value = 0;
    else
      this.value = '';
      
    this.valueOutput.emit(this.value);
  }

  isValidInput(): boolean {
    if (this.required && this.value === '')
      return false;

    if(this.internalError)
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

  isValueNumber(): boolean {
    return typeof this.value === 'number';
  }
}
