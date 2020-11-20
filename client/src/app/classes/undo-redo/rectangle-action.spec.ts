import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { RectangleAction } from '@app/classes/undo-redo/rectangle-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
describe('RectangleAction', () => {
    let rectangleActionStub: RectangleAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let rectStub: RectangleService;

    let mousePosition: Vec2;
    let mouseDownCord: Vec2;
    let primaryColor: string;
    let secondaryColor: string;
    let lineWidth: number;
    let shiftPressed: boolean;
    let selectSubTool: SubToolselected;
    let canvasSelected: boolean;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let autoSaveStub: AutomaticSaveService;
    let canvasResizerStub: CanvasResizerService;

    beforeEach(() => {
        mousePosition = { x: 5, y: 6 };
        mouseDownCord = { x: 8, y: 16 };
        primaryColor = '#000000';
        secondaryColor = '#ffffff';
        // tslint:disable:no-magic-numbers
        lineWidth = 2;
        canvasSelected = false;
        shiftPressed = true;
        selectSubTool = SubToolselected.tool1;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizerStub, drawingStub);
        rectStub = new RectangleService(drawingStub, colorStub, undoRedoStub, autoSaveStub);

        rectangleActionStub = new RectangleAction(
            mousePosition,
            mouseDownCord,
            primaryColor,
            secondaryColor,
            lineWidth,
            shiftPressed,
            selectSubTool,
            canvasSelected,
            rectStub,
            drawingStub,
        );

        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
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
                { provide: RectangleAction, useValue: rectangleActionStub },
                { provide: RectangleService, useValue: rectStub },
            ],
        });
        rectangleActionStub = TestBed.inject(RectangleAction);
        rectStub = TestBed.inject(RectangleService);
    });

    it('strokeColor and linewidth must be equal to primary color and thickness of rectangleAction', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        rectangleActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(primaryColor);
        expect(drawingStub.baseCtx.lineWidth).toEqual(lineWidth);
    });

    it('should call selectRectangle', () => {
        const selectRectangleSpy = spyOn(rectStub, 'selectRectangle').and.stub();
        rectangleActionStub.apply();
        expect(selectRectangleSpy).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(rectStub, 'clearEffectTool').and.stub();
        rectangleActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
