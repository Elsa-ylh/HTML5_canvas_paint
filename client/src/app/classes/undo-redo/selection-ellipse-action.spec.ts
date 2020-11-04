import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { canvasTestHelper } from '../canvas-test-helper';
import { Vec2 } from '../vec2';
import { SelectionEllipseAction } from './selection-ellipse-action';

describe('SelectionEllipseAction', () => {
    let selectionEllipseActionStub: SelectionEllipseAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let selectionEllipseStub: SelectionEllipseService;

    let copyPosition: Vec2;
    let selectionMove: Vec2;
    let image: HTMLImageElement; //
    let selectionRect: Vec2;
    let width: number;
    let height: number;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        copyPosition = { x: 5, y: 5 };
        selectionMove = { x: 9, y: 1 };
        image = new Image();
        selectionRect = { x: 6, y: 7 };
        width = 10;
        height = 10;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        selectionEllipseStub = new SelectionEllipseService(drawingStub, undoRedoStub);

        selectionEllipseActionStub = new SelectionEllipseAction(
            copyPosition,
            selectionMove,
            image,
            selectionRect,
            width,
            height,
            selectionEllipseStub,
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
                { provide: SelectionEllipseAction, useValue: selectionEllipseActionStub },
                { provide: SelectionEllipseService, useValue: selectionEllipseStub },
            ],
        });
        selectionEllipseActionStub = TestBed.inject(SelectionEllipseAction);
        selectionEllipseStub = TestBed.inject(SelectionEllipseService);
    });

    it('should call clearSelection', () => {
        const clearSelectionSpy = spyOn(selectionEllipseStub, 'clearSelection').and.stub();
        selectionEllipseActionStub.apply();
        expect(clearSelectionSpy).toHaveBeenCalled();
    });

    it('should call pasteSelection', () => {
        const pasteSelectionSpy = spyOn(selectionEllipseStub, 'pasteSelection').and.stub();
        selectionEllipseActionStub.apply();
        expect(pasteSelectionSpy).toHaveBeenCalled();
    });
});
