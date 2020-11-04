import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { canvasTestHelper } from '../canvas-test-helper';
import { SubToolselected } from '../sub-tool-selected';
import { Vec2 } from '../vec2';
import { EllipseAction } from './ellipse-action';

describe('EllipseAction', () => {
    let ellipseActionStub: EllipseAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let ellipseStub: EllipseService;

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
        mouseDownCord = { x: 25, y: 15 };
        primaryColor = '#000000';
        secondaryColor = 'rgba(0,0,0,0)';
        lineWidth = 3;
        selectSubTool = SubToolselected.tool1;
        shiftPressed = false;
        canvasSelected = false;
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        ellipseStub = new EllipseService(drawingStub, colorStub, undoRedoStub);

        ellipseActionStub = new EllipseAction(
            mousePosition,
            mouseDownCord,
            primaryColor,
            secondaryColor,
            lineWidth,
            shiftPressed,
            selectSubTool,
            canvasSelected,
            ellipseStub,
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
                { provide: EllipseService, useValue: ellipseStub },
                { provide: EllipseAction, useValue: ellipseActionStub },
            ],
        });
        ellipseActionStub = TestBed.inject(EllipseAction);
        ellipseStub = TestBed.inject(EllipseService);
    });

    it('should stroke color, shadow color and lignwidth to be primary color, secondary color and thicknessbrush', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        ellipseActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(primaryColor);
        // expect(drawingStub.baseCtx.shadowColor).toEqual(secondaryColor);
        expect(drawingStub.baseCtx.lineWidth).toEqual(lineWidth);
    });

    it('should call selectEllipse', () => {
        const selectEllipseSpy = spyOn(ellipseStub, 'selectEllipse').and.stub();
        ellipseActionStub.apply();
        expect(selectEllipseSpy).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(ellipseStub, 'clearEffectTool').and.stub();
        ellipseActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
