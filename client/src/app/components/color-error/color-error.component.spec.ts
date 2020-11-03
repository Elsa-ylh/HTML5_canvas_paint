import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorErrorComponent } from '@app/components/color-error/color-error.component';

let component: ColorErrorComponent;
let fixture: ComponentFixture<ColorErrorComponent>;

describe('ColorErrorComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ColorErrorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
