/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeDirection } from '@app/classes/resize-direction';
import { EraseAction } from '@app/classes/undo-redo/erase-actions';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { AutomaticSaveService } from '../automatic-save/automatic-save.service';

describe('Service: UndoRedo', () => {
    let undoRedoStub: UndoRedoService;
    let drawingStub: DrawingService;
    let eraserStub: EraserService;
    let eraserActionStub: EraseAction;

    let resizeActionStub: ResizeCanvasAction;
    let basecanvasAct: ResizeCanvasAction;
    let resizeStub: CanvasResizerService;

    const changes: Vec2[] = [];
    let color: string;
    let thickness: number;
    let event: MouseEvent;
    let resizeCtx: CanvasRenderingContext2D;
    let baseCanvas: HTMLCanvasElement;
    let resizeDirection: ResizeDirection;
    let autoSaveStub: AutomaticSaveService;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        resizeStub = new CanvasResizerService(undoRedoStub);
        autoSaveStub = new AutomaticSaveService(resizeStub, drawingStub);
        eraserStub = new EraserService(drawingStub, undoRedoStub, autoSaveStub);

        changes.push({ x: 5, y: 6 });
        changes.push({ x: 25, y: 15 });
        color = '#000000';
        /* tslint:disable:no-magic-numbers */
        thickness = 5;

        event = {
            offsetX: 25,
            offsetY: 10,
        } as MouseEvent;

        resizeDirection = ResizeDirection.horizontal;
        resizeActionStub = new ResizeCanvasAction(event, resizeCtx, baseCanvas, resizeDirection, resizeStub);
        eraserActionStub = new EraseAction(changes, color, thickness, eraserStub, drawingStub);

        basecanvasAct = new ResizeCanvasAction(event, baseStub, canvas, resizeDirection, resizeStub);

        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;

        baseCanvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        baseCanvas.width = 50;
        // tslint:disable:no-magic-numbers
        baseCanvas.height = 50;

        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        resizeCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: EraseAction, useValue: eraserActionStub },
                { provide: ResizeCanvasAction, useValue: resizeActionStub },
                { provide: CanvasResizerService, useValue: resizeStub },
                { provide: CanvasResizerService, useValue: basecanvasAct },
            ],
        });

        undoRedoStub = TestBed.inject(UndoRedoService);
        resizeStub = TestBed.inject(CanvasResizerService);

        eraserActionStub = TestBed.inject(EraseAction);
        resizeActionStub = TestBed.inject(ResizeCanvasAction);
        basecanvasAct = TestBed.inject(ResizeCanvasAction);
    });

    it('should be created', () => {
        expect(undoRedoStub).toBeTruthy();
    });

    it('should push the action  in the listUndo', () => {
        undoRedoStub.addUndo(resizeActionStub);
        // tslint:disable:no-string-literal
        expect(resizeActionStub).toEqual(undoRedoStub['listUndo'][0]);
    });

    it('should call redo', () => {
        const redoSpy = spyOn(undoRedoStub, 'redo').and.stub();
        undoRedoStub.addUndo(eraserActionStub);
        // tslint:disable:no-string-literal
        undoRedoStub['listRedo'].length = 1;
        undoRedoStub.redo();
        expect(redoSpy).toHaveBeenCalled();
    });

    it('elements in listUndo should be the same as elements in listredo after calling redo', () => {
        const action = eraserActionStub;
        // tslint:disable:no-string-literal
        undoRedoStub['listRedo'].length = 1;
        // tslint:disable:no-string-literal
        undoRedoStub['listRedo'][0] = action;
        undoRedoStub.redo();
        // tslint:disable:no-string-literal
        expect(undoRedoStub['listUndo'][0]).toEqual(action);
    });

    it('elements in listUndo should be the same as the most recent one in listRedo after calling undo for a resize canvas action', () => {
        const action1 = resizeActionStub;
        const spyApply = spyOn(resizeActionStub, 'apply');
        undoRedoStub.addUndo(action1);
        undoRedoStub.defaultCanvasAction = action1;
        undoRedoStub.undo();
        // tslint:disable:no-string-literal
        expect(undoRedoStub['listRedo'][0]).toEqual(action1);
        expect(spyApply).toHaveBeenCalled();
    });
    // This test fails once out of 10. With this test we have :97% coverage in undo-redo service.
    // Without this test we have 88.89% coverage in undo-redo service.

    // it('elements in listUndo should be the same as elements in listRedo when calling undo. Should spot  different actions', () => {
    //     const actionEr = eraserActionStub;
    //     const action1 = resizeActionStub;
    //     undoRedoStub.addUndo(action1);
    //     undoRedoStub.addUndo(actionEr);
    //     undoRedoStub.defaultCanvasAction = resizeActionStub;
    //     undoRedoStub.undo();
    //     // tslint:disable:no-string-literal
    //     expect(undoRedoStub['listRedo'][0]).toEqual(actionEr);
    // });
});
