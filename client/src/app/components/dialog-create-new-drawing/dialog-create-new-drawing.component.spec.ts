import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DialogCreateNewDrawingComponent } from './dialog-create-new-drawing.component';

describe('DialogCreateNewDrawingComponent', () => {
    // tslint:disable:no-any
    let component: DialogCreateNewDrawingComponent;
    let fixture: ComponentFixture<DialogCreateNewDrawingComponent>;
    let drawingStub: DrawingService;
    // let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasResizerStub: CanvasResizerService;
    let onConfirmClickSpy: jasmine.Spy<any>;
    let alertSpy: jasmine.Spy<any>;
    let keyboardEvent: KeyboardEvent;
    // let clearCanvasSpy: jasmine.Spy<any>;
    // let data:Data = {"data for testing": ""};

    beforeEach(async () => {
        drawingStub = new DrawingService();
        canvasResizerStub = new CanvasResizerService();
        // drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        await TestBed.configureTestingModule({
            imports: [MatDialogModule],
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
        // clearCanvasSpy = spyOn<any>(component.drawingService, 'clearCanvas')

        fixture.detectChanges();
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

    // it('should clear canvas if its not empty ', () => {
    //   component.message = "Êtes-vous sûr de vouloir effacer votre dessin actuel ?";
    //   component.onConfirmClick();
    //   component.onConfirmClick();
    // expect(clearCanvasSpy).toHaveBeenCalled();
    // });
});
