import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/tools/text.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { TextControl } from './text-control';

// tslint:disable:prefer-const
// tslint:disable:no-magic-numbers

describe('TextControl', () => {
    let textControlStub: TextControl;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let textStub: TextService;
    let undoRedoStub: UndoRedoService;

    let height: number;
    let width: number;
    // let indexLine: number;
    let primaryColor: string;
    let sizeFont: number;
    let fontStyle: string;
    let textAlign: number;
    let autoSaveStub: AutomaticSaveService;
    let canvasResizerStub: CanvasResizerService;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        primaryColor = '#000000';
        sizeFont = 20;
        fontStyle = 'Times New Roman';
        textAlign = 2;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizerStub, drawingStub);
        textStub = new TextService(drawingStub, colorStub, undoRedoStub);

        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;
        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: TextService, useValue: textStub },
            ],
        });
    });
    textStub = TestBed.inject(TextService);

    it('should be created', inject([TextControl], (textClass: TextControl) => {
        expect(textClass).toBeTruthy();
    }));

    it('checkWidthText should return true if canvas is empty', () => {
        let textOnCanvas = 'test';
        width = 10;
        expect(textControlStub.checkWidthText(previewStub, textOnCanvas)).toEqual(true);
    });

    it('checkWidthText should return true if canvas is empty', () => {
        let nbLine = 3;
        height = 10;
        expect(textControlStub.checkHeightText(nbLine)).toEqual(true);
    });
});
