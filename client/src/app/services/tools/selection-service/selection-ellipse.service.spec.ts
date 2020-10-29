/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { SelectionEllipseService } from './selection-ellipse.service';

describe('Service: SelectionEllipse', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SelectionEllipseService],
        });
    });

    it('should ...', inject([SelectionEllipseService], (service: SelectionEllipseService) => {
        expect(service).toBeTruthy();
    }));
});
