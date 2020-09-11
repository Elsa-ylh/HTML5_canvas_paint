/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KeyBindsService } from './keyBinds.service';

describe('Service: KeyBinds', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyBindsService]
    });
  });

  it('should ...', inject([KeyBindsService], (service: KeyBindsService) => {
    expect(service).toBeTruthy();
  }));
});
