import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/tools/text.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { TextAction } from './text-action';

// tslint:disable:prefer-const
// tslint:disable:no-magic-numbers

describe('TextAction', () => {
    let textActionStub: TextAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let textStub: TextService;

    let mousePosition: Vec2;
    let mouseDownCoords: Vec2;

    let primaryColor: string;
    let sizeFont: number;
    let fontStyle: string;
    let textAlign: number;
    let fontStyleBold: boolean;
    let fontStyleItalic: boolean;
    let text: string[];
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        primaryColor = '#000000';
        sizeFont = 16;
        fontStyle = 'Times New Roman';
        textAlign = 2;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        textStub = new TextService(drawingStub, colorStub, undoRedoStub);

        textActionStub = new TextAction(
            mousePosition,
            mouseDownCoords,
            primaryColor,
            sizeFont,
            fontStyle,
            textAlign,
            fontStyleItalic,
            fontStyleBold,
            text,
            textStub,
            drawingStub,
        );

        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.canvas = canvas;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: TextAction, useValue: textActionStub },
                { provide: TextService, useValue: textStub },
            ],
        });
        textActionStub = TestBed.inject(TextAction);
        textStub = TestBed.inject(TextService);
    });

    it('strokeColor and fillColor must be primary color of textAction', () => {
        let color = '#0000FF';
        primaryColor = color;
        textActionStub.apply();
        expect(drawingStub.previewCtx.strokeStyle).toEqual(color);
        expect(drawingStub.previewCtx.fillStyle).toEqual(color);
    });

    it('should call previewText', () => {
        const drawTextOnPreview = spyOn(textStub, 'drawText').and.stub();
        textActionStub.apply();
        expect(drawTextOnPreview).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(textStub, 'clearEffectTool').and.stub();
        textActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
