import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, ContentChild, ContentChildren, Directive, DoCheck, EventEmitter, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatFormFieldInputComponent } from '../util-component/mat-form-field-input/mat-form-field-input.component';
import { MatButton } from '@angular/material/button';

@Directive({
  selector: '[appMatFormFieldGroup]'
})
export class MatFormFieldGroupDirective implements AfterContentInit, AfterContentChecked {

  @Output()
  onAllInputCheck: EventEmitter<boolean> = new EventEmitter();

  @ContentChildren(MatFormFieldInputComponent, { descendants: true })
  matFromFieldInputs!: QueryList<MatFormFieldInputComponent>;

  constructor() {

  }

  ngAfterContentChecked(): void {
    this.validateAllInput();
  }

  ngAfterContentInit(): void {
  }

  validateAllInput(): boolean {
    let valid = true;
    this.matFromFieldInputs.forEach(e => {
      if (!valid)
        return;

      valid = e.isValidInput();
    });

    this.onAllInputCheck.emit(valid);
    return valid;
  }
}
