/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeDirection } from '@app/classes/resize-direction';
import { EraseAction } from '@app/classes/undo-redo/erase-actions';
import { LoadAction } from '@app/classes/undo-redo/load-action';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { GridService } from '@app/services/tools/grid.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal

describe('Service: UndoRedo', () => {
    let undoRedoStub: UndoRedoService;
    let drawingStub: DrawingService;
    let eraserStub: EraserService;
    let eraserActionStub: EraseAction;
    let loadActionStub: LoadAction;

    let resizeActionStub: ResizeCanvasAction;
    let baseCanvasAct: ResizeCanvasAction;
    let resizeStub: CanvasResizeService;
    let gridStub: GridService;

    const changes: Vec2[] = [];
    let color: string;
    let thickness: number;
    let event: MouseEvent;
    let resizeCtx: CanvasRenderingContext2D;
    let baseCanvas: HTMLCanvasElement;
    let resizeDirection: ResizeDirection;
    let autoSaveStub: AutomaticSaveService;
    let picture: CanvasImageSource;
    let canvasResizeStub: CanvasResizeService;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        autoSaveStub = new AutomaticSaveService(resizeStub, drawingStub, undoRedoStub);
        gridStub = new GridService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        resizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        eraserStub = new EraserService(drawingStub, undoRedoStub, autoSaveStub);

        picture = new Image();
        loadActionStub = new LoadAction(picture, 1, 1, drawingStub, canvasResizeStub);
        changes.push({ x: 5, y: 6 });
        changes.push({ x: 25, y: 15 });
        color = '#000000';

        thickness = 5;

        event = {
            offsetX: 25,
            offsetY: 10,
        } as MouseEvent;

        resizeDirection = ResizeDirection.horizontal;
        resizeActionStub = new ResizeCanvasAction(event, resizeCtx, baseCanvas, resizeDirection, resizeStub);
        eraserActionStub = new EraseAction(changes, color, thickness, eraserStub, drawingStub);

        baseCanvasAct = new ResizeCanvasAction(event, baseStub, canvas, resizeDirection, resizeStub);

        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;

        baseCanvas = canvasTestHelper.canvas;
        baseCanvas.width = 50;
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
                { provide: CanvasResizeService, useValue: resizeStub },
                { provide: CanvasResizeService, useValue: baseCanvasAct },
            ],
        });

        undoRedoStub = TestBed.inject(UndoRedoService);
        resizeStub = TestBed.inject(CanvasResizeService);

        eraserActionStub = TestBed.inject(EraseAction);
        resizeActionStub = TestBed.inject(ResizeCanvasAction);
        baseCanvasAct = TestBed.inject(ResizeCanvasAction);
    });

    it('should be created', () => {
        expect(undoRedoStub).toBeTruthy();
    });

    it('should push the action  in the listUndo', () => {
        undoRedoStub.addUndo(resizeActionStub);

        expect(resizeActionStub).toEqual(undoRedoStub['listUndo'][0]);
    });

    it('should call redo', () => {
        const redoSpy = spyOn(undoRedoStub, 'redo').and.stub();
        undoRedoStub.addUndo(eraserActionStub);
        undoRedoStub['listRedo'].length = 1;
        undoRedoStub.redo();
        expect(redoSpy).toHaveBeenCalled();
    });

    it('elements in listUndo should be the same as elements in listredo after calling redo', () => {
        const action = eraserActionStub;
        undoRedoStub['listRedo'].length = 1;
        undoRedoStub['listRedo'][0] = action;
        undoRedoStub.redo();
        expect(undoRedoStub['listUndo'][0]).toEqual(action);
    });

    it('elements in listUndo should be the same as the most recent one in listRedo after calling undo for a resize canvas action', () => {
        const action1 = resizeActionStub;
        const spyApply = spyOn(resizeActionStub, 'apply').and.stub();
        undoRedoStub.addUndo(action1);
        undoRedoStub.defaultCanvasAction = action1;
        undoRedoStub.undo();
        expect(undoRedoStub['listRedo'][0]).toEqual(action1);
        expect(spyApply).toHaveBeenCalled();
    });

    it('if 2 different actions are pushed should call the right one', () => {
        const action1 = resizeActionStub;
        const action2 = eraserActionStub;
        const spyEraserAction = spyOn(eraserActionStub, 'apply').and.stub();
        undoRedoStub.addUndo(action1);
        undoRedoStub.addUndo(action2);
        undoRedoStub.defaultCanvasAction = action1;
        undoRedoStub.undo();
        undoRedoStub.redo();
        expect(spyEraserAction).toHaveBeenCalled();
    });

    it('should set isLoadImg to true ', () => {
        undoRedoStub.loadImage(loadActionStub);
        expect(undoRedoStub.isLoadImg).toEqual(true);
    });

    it('should set isLoadImg to false when caling clearRedo ', () => {
        undoRedoStub.addUndo(eraserActionStub);
        undoRedoStub.clearRedo();
        expect(undoRedoStub.isLoadImg).toEqual(false);
    });

    it('should call updateStatus when calling ClearRedo ', () => {
        const updateStatusSpy = spyOn(undoRedoStub, 'updateStatus').and.stub();
        undoRedoStub.addUndo(eraserActionStub);
        undoRedoStub.clearRedo();
        expect(updateStatusSpy).toHaveBeenCalled();
    });

    it('should set isLoadImg to false when calling clearUndo ', () => {
        undoRedoStub.addUndo(eraserActionStub);
        undoRedoStub.clearUndo();
        expect(undoRedoStub.isLoadImg).toEqual(false);
    });

    it('should call updateStatus when calling clearUndo ', () => {
        const updateStatusSpy = spyOn(undoRedoStub, 'updateStatus').and.stub();
        undoRedoStub.addUndo(eraserActionStub);
        undoRedoStub.clearUndo();
        expect(updateStatusSpy).toHaveBeenCalled();
    });

    it('should set isUndoDisabled  and isRedoDisabled to true if whileDrawingUndoRedo called ', () => {
        undoRedoStub.whileDrawingUndoRedo({} as MouseEvent);
        expect(undoRedoStub.isRedoDisabled).toEqual(true);
        expect(undoRedoStub.isUndoDisabled).toEqual(true);
    });

    it('should set isUndoDisabled  and isRedoDisabled to true if whileDrawingUndoRedo called ', () => {
        undoRedoStub.activateUndo({} as MouseEvent);
        expect(undoRedoStub.isUndoDisabled).toEqual(false);
    });

    it('should call apply with type eraser ', () => {
        const eraserApplySpy = spyOn(eraserActionStub, 'apply').and.stub();
        undoRedoStub.addUndo(eraserActionStub);
        undoRedoStub.addUndo(eraserActionStub);
        undoRedoStub.undo();
        undoRedoStub.redo();
        expect(eraserApplySpy).toHaveBeenCalled();
    });
});
