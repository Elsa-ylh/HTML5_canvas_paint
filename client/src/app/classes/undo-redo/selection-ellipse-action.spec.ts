import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionEllipseAction } from '@app/classes/undo-redo/selection-ellipse-action';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionImage } from '../selection';

fdescribe('SelectionEllipseAction', () => {
    let selectionEllipseActionStub: SelectionEllipseAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let selectionEllipseStub: SelectionEllipseService;
    let magnetismStub: MagnetismService;
    let gridService: GridService;
    let rotationStub: RotationService;
    let canvasResizeStub: CanvasResizerService;

    let selection: SelectionImage;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        rotationStub = new RotationService(drawingStub);
        canvasResizeStub = new CanvasResizerService(undoRedoStub);
        gridService = new GridService(drawingStub, canvasResizeStub);
        magnetismStub = new MagnetismService(gridService);
        selectionEllipseStub = new SelectionEllipseService(drawingStub, magnetismStub, rotationStub, undoRedoStub);
        selectionEllipseActionStub = new SelectionEllipseAction(selectionEllipseStub, drawingStub, selection);
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
