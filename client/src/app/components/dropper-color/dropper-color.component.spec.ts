import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropperColorComponent } from './dropper-color.component';

describe('DropperColorComponent', () => {
    let component: DropperColorComponent;
    let fixture: ComponentFixture<DropperColorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DropperColorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DropperColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
