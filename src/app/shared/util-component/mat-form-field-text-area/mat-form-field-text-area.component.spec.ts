/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MatFormFieldTextAreaComponent } from './mat-form-field-text-area.component';

describe('MatFormFieldTextAreaComponent', () => {
  let component: MatFormFieldTextAreaComponent;
  let fixture: ComponentFixture<MatFormFieldTextAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatFormFieldTextAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatFormFieldTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
