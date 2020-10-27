/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SelectionRectangleService } from './selection-rectangle.service';

describe('Service: SelectionRectangle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionRectangleService]
    });
  });

  it('should ...', inject([SelectionRectangleService], (service: SelectionRectangleService) => {
    expect(service).toBeTruthy();
  }));
});
