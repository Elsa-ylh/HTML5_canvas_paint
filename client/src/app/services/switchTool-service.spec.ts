import { TestBed } from '@angular/core/testing';
import { SwitchToolService } from './switchTool-service';

describe('SwitchToolServiceService', () => {
    let service: SwitchToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SwitchToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
