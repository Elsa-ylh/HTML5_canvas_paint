import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
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
    let mouseDownCord: Vec2;
    let primaryColor: string;
    let sizeFont: number;
    let fontStyle: string;
    let textAlign: number;
    let isRenderingBase: boolean;
    let selectSubTool: SubToolselected;
    let autoSaveStub: AutomaticSaveService;
    let canvasResizerStub: CanvasResizerService;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        mousePosition = { x: 5, y: 6 };
        mouseDownCord = { x: 6, y: 9 };
        primaryColor = '#000000';
        sizeFont = 3;
        fontStyle = 'Times New Roman';
        textAlign = 2;
        selectSubTool = SubToolselected.tool1;
        isRenderingBase = true;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizerStub, drawingStub);
        textStub = new TextService(drawingStub, colorStub, undoRedoStub);

        textActionStub = new TextAction(
            mousePosition,
            mouseDownCord,
            primaryColor,
            sizeFont,
            fontStyle,
            textAlign,
            isRenderingBase,
            selectSubTool,
            textStub,
            drawingStub,
        );

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
                { provide: TextAction, useValue: textActionStub },
                { provide: TextService, useValue: textStub },
            ],
        });
        textActionStub = TestBed.inject(TextAction);
        textStub = TestBed.inject(TextService);
    });

    it('strokeColor and fillColor must be primary color of polygonAction', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        textActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(primaryColor);
        expect(drawingStub.baseCtx.fillStyle).toEqual(primaryColor);
    });

    it('should call previewText', () => {
        const drawTextOnPreview = spyOn(textStub, 'previewText').and.stub();
        textActionStub.apply();
        expect(drawTextOnPreview).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(textStub, 'clearEffectTool').and.stub();
        textActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
