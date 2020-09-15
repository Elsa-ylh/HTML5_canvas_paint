import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DialogCreateNewDrawingComponent } from './dialog-create-new-drawing.component';

describe('DialogCreateNewDrawingComponent', () => {
    let component: DialogCreateNewDrawingComponent;
    let fixture: ComponentFixture<DialogCreateNewDrawingComponent>;
    let drawingStub: DrawingService;

    beforeEach(async () => {
        drawingStub = new DrawingService();

        await TestBed.configureTestingModule({
            imports: [MatDialogModule],
            declarations: [DialogCreateNewDrawingComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
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
