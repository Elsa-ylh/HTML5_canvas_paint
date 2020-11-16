/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogExportEmailComponent } from './dialog-export-email.component';

describe('DialogExportEmailComponent', () => {
    let component: DialogExportEmailComponent;
    let fixture: ComponentFixture<DialogExportEmailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DialogExportEmailComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogExportEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
