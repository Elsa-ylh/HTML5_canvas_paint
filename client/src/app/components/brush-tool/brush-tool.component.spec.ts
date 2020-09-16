import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushToolComponent } from './brush-tool.component';

describe('BrushToolComponent', () => {
    let component: BrushToolComponent;
    let fixture: ComponentFixture<BrushToolComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BrushToolComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
