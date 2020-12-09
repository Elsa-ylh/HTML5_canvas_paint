/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { SelectionImage } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';
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
    let mouseEventTest: MouseEvent;
    // let drawSelectionSpy: jasmine.Spy<any>;
    // let pasteSelectionSpy: jasmine.Spy<any>;
    // let getImageDataSpy: jasmine.Spy<any>;
    // let drawSelectionRectSpy: jasmine.Spy<any>;
    // let putImageDataSpy: jasmine.Spy<any>;
    // let drawPreviewRectSpy: jasmine.Spy<any>;
    // let fillRectSpy: jasmine.Spy<any>;
    // let isInsideSelectionSpy: jasmine.Spy<any>;

    // let clearSelectionSpy: jasmine.Spy<any>;
    // let pasteArrowSelectionSpy: jasmine.Spy<any>;
    // let subscriptionMoveLeftSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveRightSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveUpSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveDownSubscribeSpy: jasmine.Spy<any>;

    // let getPositionFromMouseSpy: jasmine.Spy<any>;

    let drawingStub: DrawingService;
    let magnetismStub: MagnetismService;
    let rotationStub: RotationService;
    let undoRedoStub: UndoRedoService;
    let gridStub: GridService;
    let canvasResizeStub: CanvasResizerService;
    let selectionStub: SelectionService;
    let paintBucketStub: PaintBucketService;
    let controlMock: ControlGroup;
    let colorStub: ColorService;
    let saveStub: AutomaticSaveService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    let selectAllSimilarSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawingStub = new DrawingService();
        magicWandService = new MagicWandService(drawingStub, canvasResizeStub, paintBucketStub, magnetismStub, undoRedoStub, rotationStub);
        magnetismStub = new MagnetismService(gridStub);
        gridStub = new GridService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizeStub = new CanvasResizerService(gridStub, undoRedoStub);
        rotationStub = new RotationService(drawingStub);
        selectionStub = new SelectionService(drawingStub, magnetismStub, rotationStub);
        colorStub = new ColorService(drawingStub);
        paintBucketStub = new PaintBucketService(drawingStub, colorStub, canvasResizeStub, undoRedoStub, saveStub);

        controlMock = new ControlGroup(drawingStub);
        selectionStub["controlGroup"] = controlMock;

        // spy for private methods
        selectAllSimilarSpy = spyOn<any>(magicWandService, 'selectAllSimilar').and.callThrough();
        selectionStub.selection = new SelectionImage(drawingStub);
        selectionStub.selection.image = new Image();
        selectionStub.selection.image.src = selectionStub.selection.image.src;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: MagnetismService, useValue: magnetismStub },
                { provide: PaintBucketService, useValue: paintBucketStub },
                { provide: RotationService, useValue: rotationStub },
            ],
        });

        canvasResizeStub.canvasSize = { x: 150, y: 125 } as Vec2;

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
        // isInsideSelectionSpy = spyOn<any>(service, 'isInsideSelection').and.callThrough();
        mouseEventTest = { x: 20, y: 10, button: MouseButton.Left } as MouseEvent;
    });

    it('should be created', () => {
        expect(magicWandService).toBeTruthy();
    });

    it('should call clearEffectTool', () => {
        const clearEffectToolSpy = spyOn(magicWandService, 'clearEffectTool').and.callThrough();
        magicWandService.clearEffectTool();
        expect(clearEffectToolSpy).toHaveBeenCalled();
    });

    it('should call getPositionFromMouse', () => {
        magicWandService.mouseDown = true;
        const getPositionFromMouseSpy = spyOn<any>(magicWandService, 'getPositionFromMouse').and.callThrough();
        magicWandService.getPositionFromMouse(mouseEventTest);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call isInControlPoint if isPreviewCanvasBlank is false', () => {
        magicWandService.mouseDown = true;
        const controlGroup = new ControlGroup(drawingStub);
        controlGroup.setPositions({ x: 10, y: 15 } as Vec2, { x: 30, y: 35 } as Vec2, { x: 20, y: 20 } as Vec2);
        const isInControlPointSpy = spyOn(controlGroup, 'isInControlPoint').and.callThrough();
        const previewCanvas = document.createElement('canvas');
        drawingStub.previewCtx = previewCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingStub.previewCtx.fillRect(0, 0, 10, 10);
        magicWandService["controlGroup"] = controlGroup;
        magicWandService.onMouseDown(mouseEventTest);
        expect(isInControlPointSpy).toHaveBeenCalled();
    });

    it('should call selectedFloodFill', () => {
        canvasResizeStub.canvasSize = { x: 100, y: 100 } as Vec2;
        const mouseDownPos: Vec2 = { x: 10, y: 15 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectedFloodFill');
        magicWandService['selectedFloodFill'](mouseDownPos.x, mouseDownPos.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call selectAllSimilar', () => {
        canvasResizeStub.canvasSize = { x: 100, y: 100 } as Vec2;
        magicWandService['selectAllSimilar'](mouseEventTest.x, mouseEventTest.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(selectAllSimilarSpy).toHaveBeenCalled();
    });

    it('should onMouseDown should call selectFloodFill on left click', () => {
        const floodFillCanvas = document.createElement('canvas');
        const floodFillCtx = floodFillCanvas.getContext('2d') as CanvasRenderingContext2D;
        floodFillCanvas.height = 100;
        floodFillCanvas.width = 100;
        floodFillCtx.fillStyle = 'black';
        floodFillCtx.fillRect(0, 0, 10, 10);

        const spy = spyOn<any>(magicWandService, 'selectedFloodFill').and.returnValue(floodFillCtx.getImageData(0, 0, 100, 100));
        spyOn<any>(magicWandService, 'preparePreviewLayer').and.returnValue(floodFillCtx.getImageData(0, 0, 100, 100));
        spyOn<any>(magicWandService, 'saveSelectionData').and.callThrough();
        spyOn<any>(magicWandService, 'drawWandSelection').and.callThrough();
        const mouseEventLeftClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
        canvasResizeStub.canvasSize = { x: 150, y: 125 } as Vec2;
        magicWandService.onMouseDown(mouseEventLeftClick);
        expect(spy).toHaveBeenCalled();
    });

    it('should onMouseDown should call paintAllSimilar on right click', () => {
        const mouseEventRightClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        magicWandService.onMouseDown(mouseEventRightClick);
        expect(selectAllSimilarSpy).toHaveBeenCalled();
    });

    it(' should selectedFloodFill if user clicked in the left edge', () => {
        drawingStub.canvas.width = 150;
        drawingStub.canvas.height = 125;
        drawingStub.clearCanvas(baseCtxStub);
        baseCtxStub.fillRect(100, 100, 0, 0);
        const mouseDownPos = { x: 0, y: 0 } as Vec2;
        canvasResizeStub.canvasSize = { x: 150, y: 125 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectedFloodFill');
        magicWandService['selectedFloodFill'](mouseDownPos.x, mouseDownPos.y, { red: 10, green: 10, blue: 10, alpha: 1 } as RGBA);
        expect(spy).toHaveBeenCalled();
    });

    it(' should selectedFloodFill if user clicked in the right edge', () => {
        drawingStub.canvas.width = 100;
        drawingStub.canvas.height = 100;
        drawingStub.clearCanvas(baseCtxStub);
        baseCtxStub.fillRect(100, 100, 0, 0);
        const mouseDownPos = { x: 100, y: 100 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectedFloodFill');
        magicWandService['selectedFloodFill'](mouseDownPos.x, mouseDownPos.y, { red: 10, green: 10, blue: 10, alpha: 1 } as RGBA);
        expect(spy).toHaveBeenCalled();
    });

    it(' should selectedFloodFill if user clicked in the middle', () => {
        drawingStub.canvas.width = 100;
        drawingStub.canvas.height = 100;
        drawingStub.clearCanvas(baseCtxStub);
        baseCtxStub.fillRect(100, 100, 0, 0);
        const mouseDownPos = { x: 10, y: 10 } as Vec2;
        const spy = spyOn<any>(magicWandService, 'selectedFloodFill');
        magicWandService['selectedFloodFill'](mouseDownPos.x, mouseDownPos.y, { red: 10, green: 10, blue: 10, alpha: 1 } as RGBA);
        expect(spy).toHaveBeenCalled();
    });
});
