/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { DrawingInformationsService } from './drawing-informations.service';

describe('Service: DrawingInformations', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DrawingInformationsService],
        });
    });

    it('should ...', inject([DrawingInformationsService], (service: DrawingInformationsService) => {
        expect(service).toBeTruthy();
    }));
});
