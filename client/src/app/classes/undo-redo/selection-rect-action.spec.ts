/*

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:prefer-const
// tslint:disable:no-magic-numbers
describe('SelectionRectAction', () => {
    let selectionRectActionStub: SelectionRectAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let selectionRectStub: SelectionRectangleService;
    let copyPosition: Vec2;
    let selectionRect: Vec2;
    let width: number;
    let height: number;
    let image: ImageData = new ImageData(10, 10);
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        copyPosition = { x: 5, y: 5 };
        // tslint:disable:no-magic-numbers
        width = 10;
        // tslint:disable:no-magic-numbers
        height = 10;
        image = new ImageData(width, height);
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        selectionRectStub = new SelectionRectangleService(drawingStub, undoRedoStub);
        selectionRectActionStub = new SelectionRectAction(copyPosition, image, selectionRect, width, height, selectionRectStub);
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
                { provide: SelectionRectAction, useValue: selectionRectActionStub },
                { provide: SelectionRectangleService, useValue: selectionRectStub },
            ],
        });
        selectionRectActionStub = TestBed.inject(SelectionRectAction);
        selectionRectStub = TestBed.inject(SelectionRectangleService);
    });

    it('should call clearSelection', () => {
        const clearSelectionSpy = spyOn(selectionRectStub, 'clearSelection').and.stub();
        selectionRectActionStub.apply();
        expect(clearSelectionSpy).toHaveBeenCalled();
    });
});

*/
