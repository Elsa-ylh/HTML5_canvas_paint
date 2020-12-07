/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { MagicWandService } from './magic-wand.service';

describe('Service: MagicWand', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MagicWandService],
        });
    });

    it('should ...', inject([MagicWandService], (service: MagicWandService) => {
        expect(service).toBeTruthy();
    }));
});
