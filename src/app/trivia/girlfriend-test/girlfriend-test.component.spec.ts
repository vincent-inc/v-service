/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GirlfriendTestComponent } from './girlfriend-test.component';

describe('GirlfriendTestComponent', () => {
  let component: GirlfriendTestComponent;
  let fixture: ComponentFixture<GirlfriendTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GirlfriendTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GirlfriendTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
