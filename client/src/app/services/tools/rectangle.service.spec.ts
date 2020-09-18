/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { RectangleService } from './rectangle.service';

describe('Service: Rectangle', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RectangleService],
        });
    });

    it('should ...', inject([RectangleService], (service: RectangleService) => {
        expect(service).toBeTruthy();
    }));
});
