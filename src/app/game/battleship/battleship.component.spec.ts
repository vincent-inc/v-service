/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BattleshipComponent } from './battleship.component';

describe('BattleshipComponent', () => {
  let component: BattleshipComponent;
  let fixture: ComponentFixture<BattleshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
