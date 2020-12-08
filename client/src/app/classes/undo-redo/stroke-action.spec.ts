import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { StrokeAction } from '@app/classes/undo-redo/stroke-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

describe('StrokeAction', () => {
    // tslint:disable:prefer-const
    // tslint:disable:no-magic-numbers
    let strokeActionStub: StrokeAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let pencilStub: PencilService;
    let changes: Vec2[] = [];
    let colorPencil: string;
    let thickness: number;
    let alpha: number;
    let gridStub: GridService;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let autoSaveStub: AutomaticSaveService;
    let canvasResizerStub: CanvasResizerService;
    beforeEach(() => {
        changes.push({ x: 5, y: 6 });
        changes.push({ x: 1, y: 8 });
        colorPencil = '#000000';
        // tslint:disable:no-magic-numbers
        thickness = 2;
        // tslint:disable:no-magic-numbers
        alpha = 1;
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        gridStub = new GridService(drawingStub);
        canvasResizerStub = new CanvasResizerService(gridStub, undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizerStub, drawingStub);
        pencilStub = new PencilService(drawingStub, colorStub, undoRedoStub, autoSaveStub);
        strokeActionStub = new StrokeAction(changes, colorPencil, thickness, alpha, pencilStub, drawingStub);
        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        canvas.width = 100;
        // tslint:disable:no-magic-numbers
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

    it('should call the right strokeColor and linewidth on baseCtx', () => {
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
