import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogCreateNewDrawingComponent } from './dialog-create-new-drawing.component';

describe('DialogCreateNewDrawingComponent', () => {
    let component: DialogCreateNewDrawingComponent;
    let fixture: ComponentFixture<DialogCreateNewDrawingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogCreateNewDrawingComponent],
            providers: [{ provide: MatDialogRef, useValue: {} }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogCreateNewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
