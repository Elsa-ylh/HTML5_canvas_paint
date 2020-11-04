import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { canvasTestHelper } from '../canvas-test-helper';
import { SubToolselected } from '../sub-tool-selected';
import { Vec2 } from '../vec2';
import { RectangleAction } from './rectangle-action';

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

    beforeEach(() => {
        mousePosition = { x: 5, y: 6 };
        mouseDownCord = { x: 8, y: 16 };
        primaryColor = '#000000';
        secondaryColor = '#ffffff';
        lineWidth = 2;
        canvasSelected = false;
        shiftPressed = true;
        selectSubTool = SubToolselected.tool1;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        rectStub = new RectangleService(drawingStub, colorStub, undoRedoStub);

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

    it('should stroke color and linewidth to be primary color and thickness', () => {
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
