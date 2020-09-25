import { inject, TestBed } from '@angular/core/testing';
import { BrushService } from './brush.service';

// tslint:disable:no-any
describe('BrushService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BrushService],
        });
    });

    it('should ...', inject([BrushService], (service: BrushService) => {
        expect(service).toBeTruthy();
    }));
});
