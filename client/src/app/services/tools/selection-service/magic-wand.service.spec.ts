/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { SelectionImage } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { MagicWandService } from '@app/services/tools/selection-service/magic-wand.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { SelectionService } from '@app/services/tools/selection-service/selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:max-file-line-count
// tslint:disable:prefer-const
// tslint:disable:prettier

fdescribe('Service: MagicWand', () => {
    let magicWandService: MagicWandService;

    let drawingStub: DrawingService;
    let magnetismStub: MagnetismService;
    let rotationStub: RotationService;
    let undoRedoStub: UndoRedoService;
    let gridStub: GridService;
    let selectionStub: SelectionService;
    let controlMock: ControlGroup;

    let canvas: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawingStub = new DrawingService();
        magicWandService = new MagicWandService(drawingStub, magnetismStub, undoRedoStub, rotationStub);
        magnetismStub = new MagnetismService(gridStub);
        gridStub = new GridService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        rotationStub = new RotationService(drawingStub);
        selectionStub = new SelectionService(drawingStub, magnetismStub, rotationStub);

        controlMock = new ControlGroup(drawingStub);
        selectionStub['controlGroup'] = controlMock;

        selectionStub.selection = new SelectionImage(drawingStub);
        selectionStub.selection.image = new Image();

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: MagnetismService, useValue: magnetismStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: RotationService, useValue: rotationStub },
            ],
        });

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas as HTMLCanvasElement;

        canvasTestHelper.drawCanvas.width = 1000;
        canvasTestHelper.drawCanvas.height = 1000;
        canvas.height = 1000;
        canvas.width = 1000;

        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.baseCtx = baseCtxStub;
        drawingStub.previewCtx = previewCtxStub;
        drawingStub.canvas = canvas;
    });

    it('should be created', () => {
        expect(magicWandService).toBeTruthy();
    });

    it('should call selectedFloodFill', () => {
        const mouseDownPos: Vec2 = { x: 10, y: 15 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectedFloodFill').and.callThrough();
        magicWandService['selectedFloodFill'](mouseDownPos.x, mouseDownPos.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call selectAllSimilar', () => {
        const mouseDownPos: Vec2 = { x: 10, y: 15 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectAllSimilar').and.callThrough();
        magicWandService['selectAllSimilar'](mouseDownPos.x, mouseDownPos.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call preparePreviewLayer', () => {
        const spy = spyOn<any>(magicWandService, 'preparePreviewLayer').and.callThrough();
        magicWandService['preparePreviewLayer'](baseCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });
});
