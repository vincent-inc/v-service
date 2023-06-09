import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { MatFormFieldComponent } from '../mat-form-field/mat-form-field.component';

@Component({
  selector: 'app-mat-form-field-input-option',
  templateUrl: './mat-form-field-input-option.component.html',
  styleUrls: ['./mat-form-field-input-option.component.scss'],
  providers: [{provide: MatFormFieldComponent, useExisting: forwardRef(() => MatFormFieldInputOptionComponent)}],
})
export class MatFormFieldInputOptionComponent extends MatFormFieldComponent {

  @Input()
  options: {value: any, valueLabel: string, disable?: boolean}[] = [];

  @Input()
  noneLabel = 'None';

  constructor() {
    super();
  }
}
