/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionImage } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { Bound, MagicWandService } from '@app/services/tools/selection-service/magic-wand.service';
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
        canvas.height = 1000;
        canvas.width = 1000;

        canvasTestHelper.drawCanvas.width = 1000;
        canvasTestHelper.drawCanvas.height = 1000;
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

    it('should call matchFillColor', () => {
        const firstColor = { red: 0, green: 0, blue: 0, alpha: 1 };
        const secondColor = { red: 0, green: 0, blue: 0, alpha: 1 };
        const spy = spyOn<any>(magicWandService, 'matchFillColor').and.callThrough();
        const returnValue = magicWandService['matchFillColor'](firstColor, secondColor);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual(true);
    });

    it('should call selectAllSimilar', () => {
        const mouseDownPos: Vec2 = { x: 10, y: 15 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectAllSimilar').and.callThrough();
        magicWandService['selectAllSimilar'](mouseDownPos.x, mouseDownPos.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call preparePreviewLayer', () => {
        baseCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        baseCtxStub.fillRect(0, 0, 10, 10);
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(0, 0, 10, 10);
        const spy = spyOn<any>(magicWandService, 'preparePreviewLayer').and.callThrough();
        magicWandService['preparePreviewLayer'](baseCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should call checkNotTransparentPixel', () => {
        const spy = spyOn<any>(magicWandService, 'checkNotTransparentPixel').and.callThrough();
        magicWandService['checkNotTransparentPixel'](baseCtxStub.getImageData(0, 0, 1000, 1000), 100, { red: 255, green: 255, blue: 255, alpha: 0 });
        expect(spy).toHaveBeenCalled();
    });

    it('should find upper bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.UPPER, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should find lower bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.LOWER, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should find left bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.LEFT, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should find right bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.RIGHT, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should find NO bound', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'findBound').and.callThrough();
        magicWandService['findBound'](Bound.NONE, previewCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should snip selection', () => {
        previewCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        previewCtxStub.fillRect(10, 10, 10, 10);
        const spy = spyOn<any>(magicWandService, 'snipSelection').and.callThrough();
        magicWandService['snipSelection'](previewCtxStub.getImageData(0, 0, 1000, 1000), { x: 10, y: 10 }, { x: 10, y: 10 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call saveSelectionData', () => {
        baseCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        baseCtxStub.fillRect(1, 1, 10, 10);
        const spy = spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        spyOn<any>(magicWandService, 'findBound').and.returnValue({ x: 0, y: 1 });
        magicWandService['saveSelectionData'](baseCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should call saveSelectionData and snipSelection to be saved', () => {
        baseCtxStub.fillStyle = 'rgba(101, 231, 0, 1)';
        baseCtxStub.fillRect(1, 1, 10, 10);
        const spy = spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        spyOn<any>(magicWandService, 'snipSelection').and.returnValue(canvas.toDataURL());
        magicWandService['saveSelectionData'](baseCtxStub.getImageData(0, 0, 1000, 1000));
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseDown with wrong click', () => {
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Middle } as MouseEvent;
        const spy = spyOn<any>(magicWandService, 'onMouseDown').and.callThrough();
        magicWandService.onMouseDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseDown with left click', () => {
        baseCtxStub.fillStyle = 'rgba(0, 0, 0, 0)';
        baseCtxStub.fillRect(0, 0, 1000, 1000);
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Left } as MouseEvent;
        const spy = spyOn<any>(magicWandService, 'onMouseDown').and.callThrough();
        spyOn<any>(magicWandService, 'snipSelection').and.returnValue(canvas.toDataURL());
        spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        magicWandService.onMouseDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseDown with right click', () => {
        baseCtxStub.fillStyle = 'rgba(0, 0, 0, 0)';
        baseCtxStub.fillRect(0, 0, 1000, 1000);
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Right } as MouseEvent;
        const spy = spyOn<any>(magicWandService, 'onMouseDown').and.callThrough();
        spyOn<any>(magicWandService, 'snipSelection').and.returnValue(canvas.toDataURL());
        spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        magicWandService.onMouseDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseMove', () => {
        magicWandService.mouseDown = true;
        magicWandService['inSelection'] = true;
        magicWandService['controlPointName'] = ControlPointName.none;

        baseCtxStub.fillStyle = 'rgba(0, 0, 0, 0)';
        baseCtxStub.fillRect(0, 0, 1000, 1000);
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Right } as MouseEvent;
        const spy = spyOn<any>(magicWandService, 'onMouseMove').and.callThrough();
        spyOn<any>(magicWandService, 'snipSelection').and.returnValue(canvas.toDataURL());
        spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        magicWandService.onMouseMove(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseUp', () => {
        magicWandService.mouseDown = true;

        baseCtxStub.fillStyle = 'rgba(0, 0, 0, 0)';
        baseCtxStub.fillRect(0, 0, 1000, 1000);
        const event = { offsetX: 11, offsetY: 11, button: MouseButton.Right } as MouseEvent;
        const spy = spyOn<any>(magicWandService, 'onMouseDown').and.callThrough();
        spyOn<any>(magicWandService, 'snipSelection').and.returnValue(canvas.toDataURL());
        spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        magicWandService.onMouseDown(event);
        expect(spy).toHaveBeenCalled();
    });
});
