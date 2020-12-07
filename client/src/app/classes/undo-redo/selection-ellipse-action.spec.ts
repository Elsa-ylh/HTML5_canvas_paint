/*
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionEllipseAction } from '@app/classes/undo-redo/selection-ellipse-action';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

describe('SelectionEllipseAction', () => {
    let selectionEllipseActionStub: SelectionEllipseAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let selectionEllipseStub: SelectionEllipseService;
    let copyPosition: Vec2;
    let imageData: ImageData;
    let selectionRect: Vec2;
    let ellipseRad: Vec2;
    let width: number;
    let height: number;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    let canvasResizerStub: CanvasResizerService;
    let gridStub: GridService;
    let magnetismStub: MagnetismService;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers
        copyPosition = { x: 5, y: 5 };
        imageData = new ImageData(10, 10);
        selectionRect = { x: 6, y: 7 };
        ellipseRad = { x: 5, y: 5 };
        width = 10;
        // tslint:disable:no-magic-numbers
        height = 10;
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);
        gridStub = new GridService(drawingStub, canvasResizerStub);
        magnetismStub = new MagnetismService(gridStub);
        selectionEllipseStub = new SelectionEllipseService(drawingStub, magnetismStub);
        selectionEllipseActionStub = new SelectionEllipseAction(
            copyPosition,
            imageData,
            selectionRect,
            width,
            height,
            selectionEllipseStub,
            ellipseRad,
        );
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

*/
