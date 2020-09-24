import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DialogCreateNewDrawingComponent } from './dialog-create-new-drawing.component';

describe('DialogCreateNewDrawingComponent', () => {
    let component: DialogCreateNewDrawingComponent;
    let fixture: ComponentFixture<DialogCreateNewDrawingComponent>;
    let drawingStub: DrawingService;
    let canvasResizerStub: CanvasResizerService;

    beforeEach(async () => {
        drawingStub = new DrawingService();
        canvasResizerStub = new CanvasResizerService();

        await TestBed.configureTestingModule({
            imports: [MatDialogModule],
            declarations: [DialogCreateNewDrawingComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: DrawingService, useValue: drawingStub },
                { provide: Router, useValue: {} },
                {
                    provide: FormBuilder,
                    useValue: {
                        control: () => '',
                    },
                },
                { provide: CanvasResizerService, useValue: canvasResizerStub },
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
