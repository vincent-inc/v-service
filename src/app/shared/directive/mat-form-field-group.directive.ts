import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, ContentChild, ContentChildren, Directive, DoCheck, EventEmitter, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatFormFieldInputComponent } from '../util-component/mat-form-field-input/mat-form-field-input.component';
import { MatButton } from '@angular/material/button';
import { MatFormFieldTextAreaComponent } from '../util-component/mat-form-field-text-area/mat-form-field-text-area.component';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appMatFormFieldGroup]'
})
export class MatFormFieldGroupDirective implements AfterContentInit, AfterContentChecked, OnDestroy {

  @Output()
  onAllInputCheck: EventEmitter<boolean> = new EventEmitter();

  @Output()
  onFormSummit: EventEmitter<void> = new EventEmitter();

  @ContentChildren(MatFormFieldInputComponent, { descendants: true })
  matFromFieldInputs!: QueryList<MatFormFieldInputComponent>;

  @ContentChildren(MatFormFieldTextAreaComponent, { descendants: true })
  matFormFieldTextArea!: QueryList<MatFormFieldTextAreaComponent>;

  subscriptions: Subscription[] = []

  constructor() {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(e => {
      e.unsubscribe();
    })
  }

  ngAfterContentChecked(): void {
    this.validateAllInput();
  }

  ngAfterContentInit(): void {
    this.subscriptions = [];

    this.matFromFieldInputs.forEach(e => {
      this.subscriptions.push(
        e.onEnter.subscribe(
          res => {this.onFormSummit.emit()}
        )
      )
    })

    this.matFormFieldTextArea.forEach(e => {
      this.subscriptions.push(
        e.onEnter.subscribe(
          res => {this.onFormSummit.emit()}
        )
      )
    })
  }

  validateAllInput(): boolean {
    let valid = true;

    if(this.matFormFieldTextArea) {
      this.matFormFieldTextArea.forEach(e => {
        if (!valid)
          return;
  
        valid = e.isValidInput();
      });
    }

    if(this.matFromFieldInputs) {
      this.matFromFieldInputs.forEach(e => {
        if (!valid)
          return;
  
        valid = e.isValidInput();
      });
    }

    this.onAllInputCheck.emit(valid);
    return valid;
  }
}
