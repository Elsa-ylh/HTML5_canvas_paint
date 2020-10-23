/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { SelectionService } from './selection-service';

describe('Service: SelectionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SelectionService],
        });
    });

    it('should ...', inject([SelectionService], (service: SelectionService) => {
        expect(service).toBeTruthy();
    }));
});
