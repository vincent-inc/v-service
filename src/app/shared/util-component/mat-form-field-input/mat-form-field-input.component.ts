import { Component, Input, forwardRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatFormFieldComponent } from '../mat-form-field/mat-form-field.component';

@Component({
  selector: 'app-mat-form-field-input',
  templateUrl: './mat-form-field-input.component.html',
  styleUrls: ['./mat-form-field-input.component.scss'],
  providers: [{provide: MatFormFieldComponent, useExisting: forwardRef(() => MatFormFieldInputComponent)}],
})
export class MatFormFieldInputComponent extends MatFormFieldComponent {

  @Input()
  maxlength: string = '';

  @Input()
  placeholder: string = '';

  @Input()
  appearance: string = 'fill';

  @Input()
  matColor: ThemePalette = 'primary';

  @Input()
  width: number = 40;

  @Input()
  styleWidth?: string;

  @Input()
  autoResize: boolean = false;

  @Input()
  showGoto: boolean = false;

  @Input()
  showClearIcon: boolean = true;

  @Input()
  showVisibleSwitch: boolean = false;

  @Input()
  showCopyToClipboard: boolean = false;

  @Input()
  showGenerateValue: boolean = false;

  @Input()
  showMinMaxHint: boolean = false;

  @Input()
  alwayUppercase: boolean = false;

  @Input()
  alwayLowercase: boolean = false;

  @Input()
  manuallyEmitValue: boolean = false;

  //input copy
  @Input()
  copyDisplayMessage: string = this.value.toString();

  //switch
  @Input()
  switchVisibility: boolean = false;

  @Input()
  defaultType: string = 'text';

  @Input()
  switchType: string = 'password';

  @Input()
  onIcon: string = 'visibility';

  @Input()
  offIcon: string = 'visibility_off';

  //case of number

  @Input()
  min: string = '';

  @Input()
  max: string = '';

  constructor() {
    super();
  }

  override emitValue(): void {
    let value = this.value;

    if (this.alwayLowercase && typeof value === 'string')
      value = value.toLowerCase();

    if (this.alwayUppercase && typeof value === 'string')
      value = value.toUpperCase();

    if (this.isValueNumber() && this.min && +value < +this.min)
      value = +this.min;

    if (this.isValueNumber() && this.max && +value > +this.max)
      value = +this.max;

    this.valueOutput.emit(value);
    this.onValueChange.emit();
  }

  override isValidInput(): boolean {
    if (this.required && this.value === '')
      return false;

    if(this.exceedMax() || this.exceedMin())
      return false;

    if (this.error)
      return false;

    return true;
  }

  exceedMax(): boolean {
    if(this.isValueNumber() && this.max)
      return +this.value > +this.max;

    return false;
  }

  exceedMin(): boolean {
    if(this.isValueNumber() && this.min)
      return +this.value < +this.min;

    return false;
  }

  emitValueWithCondition(): void {
    if(this.manuallyEmitValue)
      return;

    this.emitValue();
  }

  override clear(): void {
    if (this.defaultType === 'number')
      this.value = 0;
    else
      this.value = '';

    if(this.manuallyEmitValue)
      return;
      
    this.valueOutput.emit(this.value);
    this.onValueChange.emit();
  }

  getSize(data: string): number {
    let offset = 10;
    if (this.showCopyToClipboard)
      offset += 5;
    if (this.showGenerateValue)
      offset += 5;
    if (this.showGoto)
      offset += 5;
    if (this.showVisibleSwitch)
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

  override isValueNumber(): boolean {
    return this.defaultType === 'number' || typeof this.value === 'number';
  }
}
