import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselPictureComponent } from './carrousel-picture.component';

describe('CarrouselPictureComponent', () => {
  let component: CarrouselPictureComponent;
  let fixture: ComponentFixture<CarrouselPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrouselPictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrouselPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
