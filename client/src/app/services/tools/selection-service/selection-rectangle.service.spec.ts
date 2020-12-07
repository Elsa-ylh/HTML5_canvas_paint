/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionImage } from '@app/classes/selection';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { GridService } from '../grid.service';
import { MagnetismService } from '../magnetism.service';
import { RotationService } from './rotation.service';
// import { Subscription } from 'rxjs/internal/Subscription';
// import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionRectangleService } from './selection-rectangle.service';
import { SelectionService } from './selection-service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:max-file-line-count
// tslint:disable:no-shadowed-variable
describe('Service: SelectionRectangle', () => {
    let service: SelectionRectangleService;

    // let mouseEvent: MouseEvent;

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
    // let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let drawingStub: DrawingService;
    let magnetismStub: MagnetismService;
    let rotationStub: RotationService;
    let undoStub: UndoRedoService;
    let gridStub: GridService;
    let canvasResizeStub: CanvasResizerService;
    let selectionStub: SelectionService;
    let controlMock: ControlGroup;

    let mouseEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingStub = new DrawingService();
        service = new SelectionRectangleService(drawingStub, magnetismStub, rotationStub, undoStub);
        magnetismStub = new MagnetismService(gridStub);
        gridStub = new GridService(drawingStub, canvasResizeStub);
        undoStub = new UndoRedoService(drawingStub);
        rotationStub = new RotationService(drawingStub);
        selectionStub = new SelectionService(drawingStub, magnetismStub, rotationStub);
        //   drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'isPreviewCanvasBlank']);

        controlMock = new ControlGroup(drawingStub);
        selectionStub.controlGroup = controlMock;

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas as HTMLCanvasElement;

        canvasTestHelper.drawCanvas.width = 1000;
        canvasTestHelper.drawCanvas.height = 1000;
        canvas.height = 1000;
        canvas.width = 1000;

        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        selectionStub.selection = new SelectionImage(drawingStub);
        selectionStub.selection.image = new Image();
        selectionStub.selection.image.src = selectionStub.selection.image.src;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: UndoRedoService, useValue: undoStub },
                { provide: MagnetismService, useValue: magnetismStub },
                { provide: RotationService, useValue: rotationStub },
            ],
        });

        service = TestBed.inject(SelectionRectangleService);

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas as HTMLCanvasElement;
        drawingStub.baseCtx = baseCtxStub;
        drawingStub.previewCtx = previewCtxStub;
        drawingStub.canvas = canvasTestHelper.canvas as HTMLCanvasElement;
        // isInsideSelectionSpy = spyOn<any>(service, 'isInsideSelection').and.callThrough();
        mouseEvent = { x: 15, y: 6, button: MouseButton.Left } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onmouseDown should call clearEffectTool', () => {
        const clearEffectToolSpy = spyOn(service, 'clearEffectTool').and.callThrough();
        service.onMouseDown(mouseEvent);
        expect(clearEffectToolSpy).toHaveBeenCalled();
    });

    it('onmouseDown should call getPositionFromMouse', () => {
        service.mouseDown = true;
        const getPositionFromMouseSpy = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        service.onMouseDown(mouseEvent);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    // it('onmouseDown should call isInControlPoint if isPreviewCanvasBlank is false', () => {
    //     service.mouseDown = true;
    //     const controlGroup = new ControlGroup(drawingStub);
    //     controlGroup.setPositions({ x: 10, y: 10 } as Vec2, { x: 30, y: 30 } as Vec2, { x: 20, y: 20 } as Vec2);
    //     const isInControlPointSpy = spyOn(controlGroup, 'isInControlPoint').and.callThrough();
    //     const previewCanvas = document.createElement('canvas');
    //     drawingStub.previewCtx = previewCanvas.getContext('2d') as CanvasRenderingContext2D;
    //     drawingStub.previewCtx.fillRect(0, 0, 10, 10);
    //     service.controlGroup = controlGroup;
    //     service.onMouseDown(mouseEvent);
    //     expect(isInControlPointSpy).toHaveBeenCalled();
    // });

    // it('onmouseDown should call clearCanvas  ', () => {
    //     service.mouseDown = true;
    //     service.inSelection = false;

    //     const clearCanvasSpy = spyOn(drawingStub, 'clearCanvas').and.stub();
    //     service.inSelection = false;
    //     const controlGroup = new ControlGroup(drawingStub);
    //     controlGroup.setPositions({ x: 10, y: 10 } as Vec2, { x: 30, y: 30 } as Vec2, { x: 20, y: 20 } as Vec2);
    //     const previewCanvas = document.createElement('canvas');
    //     drawingStub.previewCtx = previewCanvas.getContext('2d') as CanvasRenderingContext2D;
    //     drawingStub.previewCtx.fillRect(0, 0, 10, 10);
    //     service.controlGroup = controlGroup;
    //     service.onMouseDown(mouseEvent);
    //     service.controlPointName === ControlPointName.none;

    //     service.onMouseDown(mouseEvent);
    //     expect(clearCanvasSpy).toHaveBeenCalled();
    // });

    // it('onmouseDown should call pasteSelection  ', () => {
    //     const pasteSelectionSpy = spyOn(service, 'pasteSelection').and.stub();
    //     const isPreviewCanvasBlankSpy = spyOn(drawingStub, 'isPreviewCanvasBlank').and.stub();
    //     isPreviewCanvasBlankSpy.and.returnValue(false);

    //     service.inSelection = false;
    //     service.controlPointName === ControlPointName.none;
    //     service.onMouseDown(mouseEvent);
    //     expect(pasteSelectionSpy).toHaveBeenCalled();
    // });

    // it('test  ', () => {
    //     //const pasteSelectionSpy = spyOn(service, 'pasteSelection').and.stub();
    //     //service.inSelection = false;
    //     const isPreviewCanvasBlankSpy = spyOn(drawingStub, 'isPreviewCanvasBlank').and.callThrough();
    //     isPreviewCanvasBlankSpy.and.returnValue(false);
    //     expect(isPreviewCanvasBlankSpy).toEqual(false);
    // });

    // old tests.
    // it(' mouseDown should save mouse coord', () => {
    //     mouseEvent = {
    //         button: 0,
    //     } as MouseEvent;

    //     service.mouseDown = true;
    //     service.onMouseDown(mouseEvent);
    //     expect(getPositionFromMouseSpy).toHaveBeenCalled();
    // });

    // it(' mouseDown  not save mouse coord if the left mouse button is not pressed', () => {
    //     mouseEvent = {} as MouseEvent;
    //     service.mouseDown = false;
    //     service.onMouseDown(mouseEvent);
    //     expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
    // });

    // it(' mouseDown should check if mouse coord are in selection if a selection is drawn', () => {
    //     mouseEvent = {
    //         button: 0,
    //     } as MouseEvent;

    //     service.mouseDown = true;
    //     service.mouseDownCoord = { x: 1, y: 1 };
    //     service.onMouseDown(mouseEvent);
    //     expect(isInsideSelectionSpy).toHaveBeenCalled();
    // });

    // it(' onMouseUp should copy a selection and draw it in the preview canvas', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     const imageDataMock = new ImageData(10, 10) as ImageData;
    //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

    //     mouseEvent = {
    //         button: 0,
    //         offsetX: 25,
    //         offsetY: 25,
    //     } as MouseEvent;

    //     service.mouseDownCoord = { x: 1, y: 1 };
    //     service.shiftPressed = false;
    //     service.mouseDown = true;

    //     service.onMouseUp(mouseEvent);
    //     expect(getImageDataSpy).toHaveBeenCalled();
    //     expect(drawSelectionSpy).toHaveBeenCalled();
    // });

    // it(' onMouseUp should copy a selection and draw it in the preview canvas if shift is pressed', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     const imageDataMock = new ImageData(10, 10) as ImageData;
    //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

    //     mouseEvent = {
    //         button: 0,
    //         offsetX: 25,
    //         offsetY: 25,
    //     } as MouseEvent;

    //     service.mouseDownCoord = { x: 1, y: 1 };
    //     service.shiftPressed = true;
    //     service.mouseDown = true;

    //     service.onMouseUp(mouseEvent);
    //     expect(getImageDataSpy).toHaveBeenCalled();
    //     expect(drawSelectionSpy).toHaveBeenCalled();
    // });

    // it(' onMouseUp should not copy a selection and draw it in the preview canvas if the left mouse button was not pressed', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     const imageDataMock = new ImageData(10, 10) as ImageData;
    //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

    //     mouseEvent = {
    //         button: 0,
    //         offsetX: 25,
    //         offsetY: 25,
    //     } as MouseEvent;

    //     service.mouseDownCoord = { x: 1, y: 1 };
    //     service.shiftPressed = false;
    //     service.mouseDown = false;

    //     service.onMouseUp(mouseEvent);
    //     expect(getImageDataSpy).not.toHaveBeenCalled();
    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    // });

    // it(' onMouseUp should paste a selection if a selection has been drawn', () => {
    //     const drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     const pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
    //     service.imageData = new ImageData(10, 10);

    //     mouseEvent = {
    //         button: 0,
    //         offsetX: 25,
    //         offsetY: 25,
    //     } as MouseEvent;

    //     service.mouseDownCoord = { x: 1, y: 1 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.inSelection = true;
    //     service.mouseDown = true;

    //     service.onMouseUp(mouseEvent);
    //     expect(pasteSelectionSpy).toHaveBeenCalled();
    // });

    // it(' drawSelection should draw a selection rectangle and put the image inside it', () => {
    //     drawSelectionRectSpy = spyOn<any>(service, 'drawSelectionRect').and.callThrough();
    //     putImageDataSpy = spyOn<any>(service['drawingService'].previewCtx, 'putImageData').and.callThrough();

    //     service.imageData = new ImageData(10, 10);
    //     service['drawSelection']({ x: 1, y: 1 });
    //     expect(drawSelectionRectSpy).toHaveBeenCalled();
    //     expect(putImageDataSpy).toHaveBeenCalled();
    // });

    // it(' pasteSelection should put a selection on the canvas', () => {
    //     putImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'putImageData').and.callThrough();

    //     service.imageData = new ImageData(10, 10);
    //     service['pasteSelection']({ x: 1, y: 1 }, service.imageData);
    //     expect(putImageDataSpy).toHaveBeenCalled();
    // });

    // it(' drawPreview should draw a preview rectangle', () => {
    //     drawPreviewRectSpy = spyOn<any>(service, 'drawPreviewRect').and.callThrough();

    //     service.shiftPressed = true;
    //     service['drawPreview']();
    //     expect(drawPreviewRectSpy).toHaveBeenCalled();
    // });

    // it(' clearSelection should put a white rectangle over a selection initial position', () => {
    //     fillRectSpy = spyOn<any>(service['drawingService'].baseCtx, 'fillRect').and.callThrough();
    //     service['clearSelection']({ x: 1, y: 1 }, 10, 10);
    //     expect(fillRectSpy).toHaveBeenCalled();
    // });

    // it(' pasteArrowSelection should paste a selection moved with the arrow keys', () => {
    //     pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
    //     clearSelectionSpy = spyOn<any>(service, 'clearSelection').and.callThrough();

    //     service.timerStarted = false;
    //     service.mouseMouvement = { x: 5, y: 5 };
    //     service.width = 10;
    //     service.height = 10;
    //     service.imageData = new ImageData(10, 10);

    //     service.pasteArrowSelection();
    //     expect(clearSelectionSpy).toHaveBeenCalled();
    //     expect(pasteSelectionSpy).toHaveBeenCalled();
    // });

    // it(' pasteArrowSelection should not paste a selection if it wasnt move with the arrow keys', () => {
    //     pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
    //     clearSelectionSpy = spyOn<any>(service, 'clearSelection').and.callThrough();

    //     service.timerStarted = true;
    //     service.mouseMouvement = { x: 5, y: 5 };
    //     service.width = 10;
    //     service.height = 10;
    //     service.imageData = new ImageData(10, 10);

    //     service.pasteArrowSelection();
    //     expect(clearSelectionSpy).not.toHaveBeenCalled();
    //     expect(pasteSelectionSpy).not.toHaveBeenCalled();
    // });

    // it(' onLeftArrowUp should reset the left timer and paste the selection', () => {
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.leftArrow.timerStarted = true;
    //     service.imageData = new ImageData(10, 10);

    //     service.leftArrow.subscription = new Subscription();
    //     subscriptionMoveLeftSubscribeSpy = spyOn<any>(service.leftArrow.subscription, 'unsubscribe').and.callThrough();
    //     // pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

    //     service.onLeftArrowUp();
    //     expect(subscriptionMoveLeftSubscribeSpy).toHaveBeenCalled();
    //     // expect(pasteArrowSelectionSpy).toHaveBeenCalled();
    // });

    // it(' onLeftArrowUp should not reset the left timer and paste the selection if the preview canvas is blank', () => {
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
    //     service.leftArrow.timerStarted = true;
    //     service.imageData = new ImageData(10, 10);

    //     service.leftArrow.subscription = new Subscription();
    //     subscriptionMoveLeftSubscribeSpy = spyOn<any>(service.leftArrow.subscription, 'unsubscribe').and.callThrough();
    //     // pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

    //     service.onLeftArrowUp();
    //     expect(subscriptionMoveLeftSubscribeSpy).not.toHaveBeenCalled();
    //     // expect(pasteArrowSelectionSpy).not.toHaveBeenCalled();
    // });

    // it(' onRightArrowUp should reset the left timer and paste the selection', () => {
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.rightArrow.timerStarted = true;
    //     service.imageData = new ImageData(10, 10);

    //     service.rightArrow.subscription = new Subscription();
    //     subscriptionMoveRightSubscribeSpy = spyOn<any>(service.rightArrow.subscription, 'unsubscribe').and.callThrough();
    //     // pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

    //     service.onRightArrowUp();
    //     expect(subscriptionMoveRightSubscribeSpy).toHaveBeenCalled();
    //     // expect(pasteArrowSelectionSpy).toHaveBeenCalled();
    // });

    // it(' onRightArrowUp should not reset the left timer and paste the selection if the preview canvas is blank', () => {
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
    //     service.rightArrow.timerStarted = true;
    //     service.imageData = new ImageData(10, 10);

    //     service.rightArrow.subscription = new Subscription();
    //     subscriptionMoveRightSubscribeSpy = spyOn<any>(service.rightArrow.subscription, 'unsubscribe').and.callThrough();
    //     // pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

    //     service.onRightArrowUp();
    //     expect(subscriptionMoveRightSubscribeSpy).not.toHaveBeenCalled();
    //     // expect(pasteArrowSelectionSpy).not.toHaveBeenCalled();
    // });

    // it(' onUpArrowUp should reset the left timer and paste the selection', () => {
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.upArrow.timerStarted = true;
    //     service.imageData = new ImageData(10, 10);

    //     service.upArrow.subscription = new Subscription();
    //     subscriptionMoveUpSubscribeSpy = spyOn<any>(service.upArrow.subscription, 'unsubscribe').and.callThrough();
    //     // pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

    //     service.onUpArrowUp();
    //     expect(subscriptionMoveUpSubscribeSpy).toHaveBeenCalled();
    //     // expect(pasteArrowSelectionSpy).toHaveBeenCalled();
    // });

    // it(' onUpArrowUp should not reset the left timer and paste the selection if the preview canvas is blank', () => {
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
    //     service.upArrow.timerStarted = true;
    //     service.imageData = new ImageData(10, 10);

    //     service.upArrow.subscription = new Subscription();
    //     subscriptionMoveUpSubscribeSpy = spyOn<any>(service.upArrow.subscription, 'unsubscribe').and.callThrough();
    //     // pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

    //     service.onUpArrowUp();
    //     expect(subscriptionMoveUpSubscribeSpy).not.toHaveBeenCalled();
    //     // expect(pasteArrowSelectionSpy).not.toHaveBeenCalled();
    // });

    // it(' onDownArrowUp should reset the left timer and paste the selection', () => {
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.downArrow.timerStarted = true;
    //     service.imageData = new ImageData(10, 10);

    //     service.downArrow.subscription = new Subscription();
    //     subscriptionMoveDownSubscribeSpy = spyOn<any>(service.downArrow.subscription, 'unsubscribe').and.callThrough();
    //     // pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

    //     service.onDownArrowUp();
    //     expect(subscriptionMoveDownSubscribeSpy).toHaveBeenCalled();
    //     // expect(pasteArrowSelectionSpy).toHaveBeenCalled();
    // });

    // it(' onDownArrowUp should reset the left timer and paste the selection', () => {
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
    //     service.downArrow.timerStarted = true;
    //     service.imageData = new ImageData(10, 10);

    //     service.downArrow.subscription = new Subscription();
    //     subscriptionMoveDownSubscribeSpy = spyOn<any>(service.downArrow.subscription, 'unsubscribe').and.callThrough();
    //     // pasteArrowSelectionSpy = spyOn<any>(service, 'pasteArrowSelection').and.callThrough();

    //     service.onDownArrowUp();
    //     expect(subscriptionMoveDownSubscribeSpy).not.toHaveBeenCalled();
    //     // expect(pasteArrowSelectionSpy).not.toHaveBeenCalled();
    // });
});
