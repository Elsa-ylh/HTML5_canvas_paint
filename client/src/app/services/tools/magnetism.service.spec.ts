/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { MagnetismService } from './magnetism.service';

describe('Service: Magnetism', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MagnetismService],
        });
    });

    it('should ...', inject([MagnetismService], (service: MagnetismService) => {
        expect(service).toBeTruthy();
    }));
});
