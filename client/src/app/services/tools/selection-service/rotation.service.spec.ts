/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RotationService } from './rotation.service';

describe('Service: Rotation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RotationService]
    });
  });

  it('should ...', inject([RotationService], (service: RotationService) => {
    expect(service).toBeTruthy();
  }));
});
