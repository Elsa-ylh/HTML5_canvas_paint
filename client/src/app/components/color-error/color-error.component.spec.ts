import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog/dialog-module';
import { ColorErrorComponent } from '@app/components/color-error/color-error.component';

let component: ColorErrorComponent;
let fixture: ComponentFixture<ColorErrorComponent>;

describe('ColorErrorComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatButtonModule, MatDialogModule],
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
