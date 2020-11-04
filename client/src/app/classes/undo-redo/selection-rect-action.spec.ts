import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { canvasTestHelper } from '../canvas-test-helper';
import { Vec2 } from '../vec2';
import { SelectionRectAction } from './selection-rect-action';

describe('SelectionRectAction', () => {
    let selectionRectActionStub: SelectionRectAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let selectionRectStub: SelectionRectangleService;

    let copyPosition: Vec2;
    let selectionRect: Vec2;
    let width: number = 10;
    let height: number = 10;
    let image: ImageData = new ImageData(10, 10);

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        copyPosition = { x: 5, y: 5 };
        width = 10;
        height = 10;
        image = new ImageData(width, height);

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        selectionRectStub = new SelectionRectangleService(drawingStub, undoRedoStub);

        selectionRectActionStub = new SelectionRectAction(copyPosition, image, selectionRect, width, height, selectionRectStub);

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

    // it('should call pasteSelection', () => {
    //     const pasteSelectionSpy = spyOn(selectionRectStub, 'pasteSelection').and.stub();
    //     selectionRectActionStub.apply();
    //     expect(pasteSelectionSpy).toHaveBeenCalled();
    // });
});
