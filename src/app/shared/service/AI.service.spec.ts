/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AIService } from './AI.service';

describe('Service: AI', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AIService]
    });
  });

  it('should ...', inject([AIService], (service: AIService) => {
    expect(service).toBeTruthy();
  }));
});
