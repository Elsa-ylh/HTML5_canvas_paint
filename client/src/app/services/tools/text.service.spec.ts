/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';
import { TextService } from './text.service';

describe('Service: Text', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TextService],
        });
    });

    it('should ...', inject([TextService], (service: TextService) => {
        expect(service).toBeTruthy();
    }));
});
