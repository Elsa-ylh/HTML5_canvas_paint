import { TestBed } from '@angular/core/testing';
import { StampService } from '@app/services/tools/stamp.service';

describe('StampService', () => {
    let service: StampService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
