/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { EraseAction } from '@app/classes/undo-redo/erase-actions';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

describe('Service: UndoRedo', () => {
    let undoRedoStub: UndoRedoService;
    let drawingStub: DrawingService;
    let eraserStub: EraserService;
    let eraserActionStub: EraseAction;

    let changesEraser: Vec2[] = [];
    let color: string;
    let thickness: number;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        eraserStub = new EraserService(drawingStub, undoRedoStub);

        changesEraser.push({ x: 5, y: 6 });
        changesEraser.push({ x: 25, y: 15 });
        color = '#000000';
        /* tslint:disable:no-magic-numbers */
        thickness = 5;

        eraserActionStub = new EraseAction(changesEraser, color, thickness, eraserStub, drawingStub);

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
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: EraseAction, useValue: eraserActionStub },
            ],
        });

        undoRedoStub = TestBed.inject(UndoRedoService);
        eraserActionStub = TestBed.inject(EraseAction);
    });

    it('should be created', () => {
        expect(undoRedoStub).toBeTruthy();
    });

    // it('should redo the lastest action and pushed into the undoList', () => {
    //     const redoSpy = spyOn(undoRedoStub, 'redo').and.stub();
    //     undoRedoStub.addUndo(eraserActionStub);
    //     expect(redoSpy).toHaveBeenCalled();
    // });
});
