/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { LineService } from './line.service';

describe('Service: Line', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LineService],
        });
    });

    it('should ...', inject([LineService], (service: LineService) => {
        expect(service).toBeTruthy();
    }));
});
