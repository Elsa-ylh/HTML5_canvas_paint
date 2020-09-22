import { TestBed } from '@angular/core/testing';

import { ThichBrushService } from './thich-brush.service';

describe('ThichBrushService', () => {
  let service: ThichBrushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThichBrushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
