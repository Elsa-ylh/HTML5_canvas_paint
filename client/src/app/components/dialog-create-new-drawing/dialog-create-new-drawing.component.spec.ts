import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { DialogCreateNewDrawingComponent } from './dialog-create-new-drawing.component';

describe('DialogCreateNewDrawingComponent', () => {
    // tslint:disable:no-any
    let component: DialogCreateNewDrawingComponent;
    let fixture: ComponentFixture<DialogCreateNewDrawingComponent>;
    let drawingStub: DrawingService;
    let canvasResizerStub: CanvasResizerService;
    let onConfirmClickSpy: jasmine.Spy<any>;
    let alertSpy: jasmine.Spy<any>;
    let keyboardEvent: KeyboardEvent;
    let undoRedoStub: UndoRedoService;

    beforeEach(async () => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);

        await TestBed.configureTestingModule({
            imports: [MatDialogModule, MatIconModule, MatGridListModule, BrowserAnimationsModule, HttpClientModule],
            declarations: [DialogCreateNewDrawingComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: { close: () => '' } },
                { provide: DrawingService, useValue: { drawingStub, isCanvasBlank: () => false } },
                { provide: Router, useValue: { navigate: () => '' } },
                { provide: CanvasResizerService, useValue: canvasResizerStub },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogCreateNewDrawingComponent);
        component = fixture.componentInstance;
        onConfirmClickSpy = spyOn<any>(component, 'onConfirmClick').and.callThrough();
        alertSpy = spyOn<any>(window, 'alert').and.callThrough();

        fixture.detectChanges();
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call onConfirmClick when pressing enter', () => {
        keyboardEvent = new KeyboardEvent('keypress', {
            key: 'Enter',
        });
        component.onEnter(keyboardEvent);
        expect(onConfirmClickSpy).toHaveBeenCalled();
    });

    it('should create an alert the canvas isnt blank', () => {
        component.message = 'Êtes-vous sûr de vouloir effacer votre dessin actuel ?';
        component.onConfirmClick();
        expect(alertSpy).toHaveBeenCalled();
    });

    it('should create an alert the canvas isnt blank', () => {
        component.message = 'Êtes-vous sûr de vouloir effacer votre dessin actuel ?';
        component.onConfirmClick();
        expect(alertSpy).toHaveBeenCalled();
    });
});
