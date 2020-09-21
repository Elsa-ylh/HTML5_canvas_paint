/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EllipseService } from './ellipse.service';

describe('Service: Ellipse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EllipseService]
    });
  });

  it('should ...', inject([EllipseService], (service: EllipseService) => {
    expect(service).toBeTruthy();
  }));
});
