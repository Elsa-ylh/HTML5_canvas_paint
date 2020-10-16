/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { PaintBucketService } from './paint-bucket.service';

describe('Service: PaintBucket', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PaintBucketService],
        });
    });

    it('should ...', inject([PaintBucketService], (service: PaintBucketService) => {
        expect(service).toBeTruthy();
    }));
});
