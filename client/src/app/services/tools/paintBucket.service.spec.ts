/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaintBucketService } from './paintBucket.service';

describe('Service: PaintBucket', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaintBucketService]
    });
  });

  it('should ...', inject([PaintBucketService], (service: PaintBucketService) => {
    expect(service).toBeTruthy();
  }));
});
