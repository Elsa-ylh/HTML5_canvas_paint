import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { canvasTestHelper } from '../canvas-test-helper';
import { Vec2 } from '../vec2';
import { StrokeAction } from './stroke-action';

describe('StrokeAction', () => {
    let strokeActionStub: StrokeAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let pencilStub: PencilService;

    let changes: Vec2[] = [];
    let colorPencil: string;
    let thickness: number;
    let alpha: number;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        changes.push({ x: 5, y: 6 });
        changes.push({ x: 1, y: 8 });
        colorPencil = '#000000';
        thickness = 2;
        alpha = 1;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        pencilStub = new PencilService(drawingStub, colorStub, undoRedoStub);

        strokeActionStub = new StrokeAction(changes, colorPencil, thickness, alpha, pencilStub, drawingStub);

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
                { provide: StrokeAction, useValue: strokeActionStub },
                { provide: PencilService, useValue: pencilStub },
            ],
        });
        strokeActionStub = TestBed.inject(StrokeAction);
        pencilStub = TestBed.inject(PencilService);
    });

    it('should call the right stroke color and linewidth', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        strokeActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(colorPencil);
        expect(drawingStub.baseCtx.lineWidth).toEqual(thickness);
    });

    it('should call drawLine', () => {
        const drawLineSpy = spyOn(pencilStub, 'drawLine').and.stub();
        strokeActionStub.apply();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(pencilStub, 'clearEffectTool').and.stub();
        strokeActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
