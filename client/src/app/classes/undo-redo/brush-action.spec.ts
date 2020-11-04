import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { canvasTestHelper } from '../canvas-test-helper';
import { PointArc } from '../point-arc';
import { SubToolselected } from '../sub-tool-selected';
import { Vec2 } from '../vec2';
import { BrushAction } from './brush-action';

describe('BrushAction', () => {
    let brushActionStub: BrushAction;
    let brushAction2: BrushAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let brushStub: BrushService;
    let changesBrush: Vec2[] = [];
    let brushPointData: PointArc[] = [];
    let primaryColor: string;
    let secondaryColor: string;
    let thicknessBrush: number = 3;
    let selectedBrushTool1: SubToolselected;
    let selectedBrushTool2: SubToolselected;
    let vec2: Vec2 = { x: 0, y: 0 };
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;

    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        vec2.x = 5;
        vec2.y = 6;
        changesBrush.push({ x: 5, y: 6 });
        changesBrush.push({ x: 25, y: 15 });
        primaryColor = '#ffffff';
        secondaryColor = 'rgba(0,0,0,0)';
        thicknessBrush = 3;
        selectedBrushTool1 = SubToolselected.tool4;
        selectedBrushTool2 = SubToolselected.tool1;
        const pt1 = new PointArc(vec2, 5, 1);
        const pt2 = new PointArc(vec2, 12, 1);
        brushPointData.push(pt1, pt2);
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        brushStub = new BrushService(drawingStub, colorStub, undoRedoStub);
        brushActionStub = new BrushAction(
            changesBrush,
            brushPointData,
            primaryColor,
            secondaryColor,
            thicknessBrush,
            selectedBrushTool1,
            brushStub,
            drawingStub,
        );

        brushAction2 = new BrushAction(
            changesBrush,
            brushPointData,
            primaryColor,
            secondaryColor,
            thicknessBrush,
            selectedBrushTool2,
            brushStub,
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
                { provide: BrushService, useValue: brushStub },
                { provide: BrushAction, useValue: brushActionStub },
            ],
        });
        brushActionStub = TestBed.inject(BrushAction);
        brushStub = TestBed.inject(BrushService);
    });

    it('should stroke color, shadow color and lignwidth to be primary color, secondary color and thicknessbrush', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        brushActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(primaryColor);
        // expect(drawingStub.baseCtx.shadowColor).toEqual(secondaryColor);
        expect(drawingStub.baseCtx.lineWidth).toEqual(thicknessBrush);
    });

    it('should call switchBrush', () => {
        const switchSpy = spyOn(brushStub, 'switchBrush').and.stub();
        brushActionStub.apply();
        expect(switchSpy).toHaveBeenCalled();
    });

    it('should call drawLine', () => {
        const drawLineSpy = spyOn(brushStub, 'drawLine').and.stub();
        brushActionStub.apply();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call drawBrushTool4', () => {
        const drawBrushTool4Spy = spyOn(brushStub, 'drawBrushTool4').and.stub();
        brushActionStub.apply();
        expect(drawBrushTool4Spy).toHaveBeenCalled();
    });

    it('should not call drawBrushTool4', () => {
        const drawBrushTool4Spy = spyOn(brushStub, 'drawBrushTool4').and.stub();
        brushAction2.apply();
        expect(drawBrushTool4Spy).not.toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(brushStub, 'clearEffectTool').and.stub();
        brushActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
