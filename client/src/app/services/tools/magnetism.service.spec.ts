/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { CanvasResizerService } from '../canvas/canvas-resizer.service';
import { DrawingService } from '../drawing/drawing.service';
import { GridService } from './grid.service';
import { MagnetismService } from './magnetism.service';

let gridService: GridService;

let canvasResizerService: CanvasResizerService;
let drawingService: DrawingService;
let magnetismService: MagnetismService;

let baseCtxStub: CanvasRenderingContext2D;
let previewCtxStub: CanvasRenderingContext2D;

fdescribe('Service: Magnetism', () => {
    beforeEach(() => {
        drawingService = new DrawingService();
        gridService = new GridService(drawingService, canvasResizerService);
        magnetismService = new MagnetismService(gridService);

        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridService }],
        });

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingService.baseCtx = baseCtxStub;
        drawingService.previewCtx = previewCtxStub;
    });

    it('should magnetismService exist', () => {
        expect(magnetismService).toBeTruthy();
    });
});
