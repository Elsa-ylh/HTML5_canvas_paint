/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { CanvasResizerService } from '../canvas/canvas-resizer.service';
import { DrawingService } from '../drawing/drawing.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { GridService } from './grid.service';

let service: GridService;

let drawingStub: DrawingService;
let undoRedoStub: UndoRedoService;
let canvasResizerStub: CanvasResizerService;

let baseCtxStub: CanvasRenderingContext2D;
let previewCtxStub: CanvasRenderingContext2D;

fdescribe('Service: Grid', () => {
    beforeEach(() => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: CanvasResizerService, useValue: canvasResizerStub },
            ],
        });
        service = TestBed.inject(GridService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingStub['baseCtx'] = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawingStub['previewCtx'] = previewCtxStub;
    });

    it('should gridService be truthy', () => {
        expect(service).toBeTruthy();
    });
});
