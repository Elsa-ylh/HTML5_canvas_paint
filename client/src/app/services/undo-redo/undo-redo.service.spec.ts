/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { EraseAction } from '@app/classes/undo-redo/erase-actions';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '../drawing/drawing.service';
import { EraserService } from '../tools/eraser-service';
import { UndoRedoService } from './undo-redo.service';

describe('Service: UndoRedo', () => {
    let undoRedoStub: UndoRedoService;
    let drawingStub: DrawingService;
    let eraserStub: EraserService;

    beforeEach(() => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        eraserStub = new EraserService(drawingStub, undoRedoStub);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
            ],
        });

        undoRedoStub = TestBed.inject(UndoRedoService);
    });

    it('should be created', () => {
        expect(undoRedoStub).toBeTruthy();
    });

    it('should set isUndoDisabled and isRedoDisabled to true ', () => {
        undoRedoStub.undoRedoDisabled();
        expect(undoRedoStub.isUndoDisabled).toEqual(true);
        expect(undoRedoStub.isRedoDisabled).toEqual(true);
    });

    it('should redo the lastest action and pushed into the undoList', () => {
        let path: Vec2[] = [];
        path.push({ x: 10, y: 15 }, { x: 20, y: 25 });
        const actionTest = new EraseAction(path, '#FFFFF', 3, eraserStub, drawingStub);

        // const actionSpy = spyOn().and.stub();
        const redoSpy = spyOn(undoRedoStub, 'redo').and.callThrough();

        undoRedoStub.addUndo(actionTest);
        undoRedoStub.redo();
        // expect(actionSpy).toHaveBeenCalled();
        expect(redoSpy).toHaveBeenCalled();
    });

    it('should clear the list listUndo', () => {
        let path: Vec2[] = [];
        path.push({ x: 10, y: 15 }, { x: 20, y: 25 });
        const actionTest = new EraseAction(path, '#FFFFF', 3, eraserStub, drawingStub);
        undoRedoStub.addUndo(actionTest);
        undoRedoStub.clearUndo();
        // expect( );
    });

    it('should add an element into the listUndo', () => {   
                
    });
});
