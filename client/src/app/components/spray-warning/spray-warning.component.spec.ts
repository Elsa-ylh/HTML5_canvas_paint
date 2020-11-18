import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprayWarningComponent } from './spray-warning.component';

describe('SprayWarningComponent', () => {
  let component: SprayWarningComponent;
  let fixture: ComponentFixture<SprayWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprayWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
