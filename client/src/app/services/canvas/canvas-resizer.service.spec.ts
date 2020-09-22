/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CanvasResizerService } from './canvas-resizer.service';

describe('Service: CanvasResizer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasResizerService]
    });
  });

  it('should ...', inject([CanvasResizerService], (service: CanvasResizerService) => {
    expect(service).toBeTruthy();
  }));
});
