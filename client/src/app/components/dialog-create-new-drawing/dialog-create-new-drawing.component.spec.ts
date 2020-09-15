import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DialogCreateNewDrawingComponent } from './dialog-create-new-drawing.component';

describe('DialogCreateNewDrawingComponent', () => {
    let component: DialogCreateNewDrawingComponent;
    let fixture: ComponentFixture<DialogCreateNewDrawingComponent>;
    let drawingStub: DrawingService;
    let dialog: MatDialog;
    let newDrawingDialogRef: MatDialogRef<DialogCreateNewDrawingComponent>;

    beforeEach(async () => {
        drawingStub = new DrawingService();
        dialog.open(DialogCreateNewDrawingComponent);

        await TestBed.configureTestingModule({
            declarations: [DialogCreateNewDrawingComponent],
            providers: [
                { provide: MAT_DIALOG_DATA },
                { provide: MatDialogRef, useValue: newDrawingDialogRef },
                { provide: DrawingService, useValue: drawingStub },
            ],
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
