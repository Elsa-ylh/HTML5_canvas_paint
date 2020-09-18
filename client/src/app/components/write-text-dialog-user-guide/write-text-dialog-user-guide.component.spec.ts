import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WriteTextDialogUserGuideComponent } from './write-text-dialog-user-guide.component';

describe('WriteTextDialogUserGuideComponent', () => {
    let component: WriteTextDialogUserGuideComponent;
    let fixture: ComponentFixture<WriteTextDialogUserGuideComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WriteTextDialogUserGuideComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WriteTextDialogUserGuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
