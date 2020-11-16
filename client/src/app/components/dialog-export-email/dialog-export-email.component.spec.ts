/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DialogExportEmailComponent } from './dialog-export-email.component';

describe('DialogExportEmailComponent', () => {
    let component: DialogExportEmailComponent;
    let fixture: ComponentFixture<DialogExportEmailComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [DialogExportEmailComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogExportEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
