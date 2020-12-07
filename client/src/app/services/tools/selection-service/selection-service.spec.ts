/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { Subscription } from 'rxjs';
import { SelectionService } from './selection-service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:max-file-line-count
// tslint:disable:no-shadowed-variable
describe('Service: SelectionService', () => {
    let service: SelectionService;
    // let mouseEvent: MouseEvent;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    // let getPositionFromMouseSpy: jasmine.Spy<any>;
    // // let isInsideSelectionSpy: jasmine.Spy<any>;
    // let drawPreviewSpy: jasmine.Spy<any>;
    let drawSelectionSpy: jasmine.Spy<any>;
    // let onMouseUpSpy: jasmine.Spy<any>;
    // let fillRectSpy: jasmine.Spy<any>;
    // let getImageDataSpy: jasmine.Spy<any>;
    // let moveSelectiontimerRightSpy: jasmine.Spy<any>;
    // let moveSelectiontimerLeftSpy: jasmine.Spy<any>;
    // let moveSelectiontimerUpSpy: jasmine.Spy<any>;
    // let moveSelectiontimerDownSpy: jasmine.Spy<any>;
    // let subscriptionTimerSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveUpSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveDownSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveLeftSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveRightSubscribeSpy: jasmine.Spy<any>;
    let copySelectionSpy: jasmine.Spy<any>;
    let scaleSelectionSpy: jasmine.Spy<any>;
    let drawPreviewSpy: jasmine.Spy<any>;
    let pasteSelectionSpy: jasmine.Spy<any>;
    let onMouseUpSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'isPreviewCanvasBlank']);
        TestBed.configureTestingModule({
            providers: [SelectionService, { provide: DrawingService, useValue: drawServiceSpy }],
        });

        service = TestBed.inject(SelectionService);
        // getPositionFromMouseSpy = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        // isInsideSelectionSpy = spyOn<any>(service, 'isInsideSelection').and.callThrough();
        // drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();
        // copySelectionSpy = spyOn<any>(service, 'copySelection').and.callThrough();

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas as HTMLCanvasElement;
    });

    it('should be created', inject([SelectionService], (service: SelectionService) => {
        expect(service).toBeTruthy();
    }));

    it(' onMouseUp should copy a selection and draw it if the selection is done being drawn', () => {
        copySelectionSpy = spyOn<any>(service, 'copySelection').and.callThrough();
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 11,
            offsetY: 11,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['controlPointName'] = ControlPointName.none;
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseUp(mouseEvent);
        expect(copySelectionSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should draw a selection that has been scaled or moved', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 11,
            offsetY: 11,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = true;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['controlPointName'] = ControlPointName.none;
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseUp(mouseEvent);
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should draw a selection with new coordinates when the selection has been moved', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = true;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['previousMousePos'] = { x: 10, y: 10 };
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseMove(mouseEvent);
        expect(service['mouseMovement']).toEqual({ x: 10, y: 10 });
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should scale and draw a selection if a control point has been selected', () => {
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
        scaleSelectionSpy = spyOn<any>(service, 'scaleSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = true;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['previousMousePos'] = { x: 10, y: 10 };
        service['controlPointName'] = ControlPointName.left;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseMove(mouseEvent);
        expect(scaleSelectionSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should draw a preview of a selection if a selection is being drawn', () => {
        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['previousMousePos'] = { x: 10, y: 10 };
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' onMouseOut should put the image back on its initial position if a selection has been drawn', () => {
        pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = true;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.copyImageInitialPos = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);
        service.selection.image = new Image();
        service.onMouseOut(mouseEvent);
        expect(pasteSelectionSpy).toHaveBeenCalled();
    });

    it(' onMouseOut should call the onMouseUp function if a selection is being drawn', () => {
        onMouseUpSpy = spyOn<any>(service, 'onMouseUp');

        const mouseEvent = {
            button: 0,
            offsetX: 20,
            offsetY: 20,
        } as MouseEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.copyImageInitialPos = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.onMouseOut(mouseEvent);
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it(' onShiftKeyDown should redraw the preview selection with the appropriate size', () => {
        drawPreviewSpy = spyOn<any>(service, 'drawPreview');
        const keyEvent = {} as KeyboardEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.onShiftKeyDown(keyEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    // it(' onMouseMove should draw a preview if user is drawing a selection', () => {
    //     mouseEvent = {
    //         button: 0,
    //         offsetX: 25,
    //         offsetY: 25,
    //     } as MouseEvent;

    //     service.mouseDown = true;
    //     service.inSelection = false;
    //     service.onMouseMove(mouseEvent);
    //     expect(drawPreviewSpy).toHaveBeenCalled();
    // });

    // it(' onMouseMove should draw the selection if user is moving a selection', () => {
    //     mouseEvent = {
    //         button: 0,
    //         offsetX: 25,
    //         offsetY: 25,
    //     } as MouseEvent;
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.mouseDown = true;
    //     service.inSelection = true;
    //     service.mouseDownCoord = { x: 1, y: 1 };
    //     service.mouseMouvement = { x: 20, y: 20 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     service.onMouseMove(mouseEvent);
    //     expect(drawSelectionSpy).toHaveBeenCalled();
    // });

    // it(' onMouseMove should not save mouse position if the mouse left button is not pressed', () => {
    //     mouseEvent = {} as MouseEvent;
    //     service.mouseDown = false;
    //     service.onMouseMove(mouseEvent);
    //     expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
    // });

    // it(' onEscapeKey should reset the canvas if a selection has been drawn and reset all the arrow timers', () => {
    //     const keyEvent = {} as KeyboardEvent;
    //     service.imageData = baseCtxStub.createImageData(10, 10);
    //     service.inSelection = true;
    //     service.copyImageInitialPos = { x: 1, y: 1 };

    //     service.downArrow.timerStarted = true;
    //     service.upArrow.timerStarted = true;
    //     service.leftArrow.timerStarted = true;
    //     service.rightArrow.timerStarted = true;
    //     service.timerStarted = true;

    //     service.subscriptionTimer = new Subscription();
    //     service.rightArrow.subscription = new Subscription();
    //     service.leftArrow.subscription = new Subscription();
    //     service.upArrow.subscription = new Subscription();
    //     service.downArrow.subscription = new Subscription();

    //     subscriptionTimerSubscribeSpy = spyOn<any>(service.subscriptionTimer, 'unsubscribe').and.callThrough();
    //     subscriptionMoveUpSubscribeSpy = spyOn<any>(service.upArrow.subscription, 'unsubscribe').and.callThrough();
    //     subscriptionMoveRightSubscribeSpy = spyOn<any>(service.rightArrow.subscription, 'unsubscribe').and.callThrough();
    //     subscriptionMoveLeftSubscribeSpy = spyOn<any>(service.leftArrow.subscription, 'unsubscribe').and.callThrough();
    //     subscriptionMoveDownSubscribeSpy = spyOn<any>(service.downArrow.subscription, 'unsubscribe').and.callThrough();

    //     service.onKeyEscape(keyEvent);
    //     expect(subscriptionTimerSubscribeSpy).toHaveBeenCalled();
    //     expect(subscriptionMoveRightSubscribeSpy).toHaveBeenCalled();
    //     expect(subscriptionMoveLeftSubscribeSpy).toHaveBeenCalled();
    //     expect(subscriptionMoveUpSubscribeSpy).toHaveBeenCalled();
    //     expect(subscriptionMoveDownSubscribeSpy).toHaveBeenCalled();
    //     expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    // });

    // it(' onEscapeKey should not reset the canvas if a selection has not been drawn and reset not all the arrow timers', () => {
    //     const keyEvent = {} as KeyboardEvent;
    //     service.imageData = baseCtxStub.createImageData(10, 10);
    //     service.inSelection = false;
    //     service.mouseDown = false;
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);

    //     service.copyImageInitialPos = { x: 1, y: 1 };

    //     service.onKeyEscape(keyEvent);

    //     expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    // });

    // it(' onEscapeKey not reset all the arrow timers if they are not started', () => {
    //     const keyEvent = {} as KeyboardEvent;
    //     service.imageData = baseCtxStub.createImageData(10, 10);
    //     service.inSelection = true;
    //     service.copyImageInitialPos = { x: 1, y: 1 };

    //     service.downArrow.timerStarted = false;
    //     service.upArrow.timerStarted = false;
    //     service.leftArrow.timerStarted = false;
    //     service.rightArrow.timerStarted = false;
    //     service.timerStarted = false;

    //     service.subscriptionTimer = new Subscription();
    //     service.rightArrow.subscription = new Subscription();
    //     service.leftArrow.subscription = new Subscription();
    //     service.upArrow.subscription = new Subscription();
    //     service.downArrow.subscription = new Subscription();

    //     subscriptionTimerSubscribeSpy = spyOn<any>(service.subscriptionTimer, 'unsubscribe').and.callThrough();
    //     subscriptionMoveUpSubscribeSpy = spyOn<any>(service.upArrow.subscription, 'unsubscribe').and.callThrough();
    //     subscriptionMoveRightSubscribeSpy = spyOn<any>(service.rightArrow.subscription, 'unsubscribe').and.callThrough();
    //     subscriptionMoveLeftSubscribeSpy = spyOn<any>(service.leftArrow.subscription, 'unsubscribe').and.callThrough();
    //     subscriptionMoveDownSubscribeSpy = spyOn<any>(service.downArrow.subscription, 'unsubscribe').and.callThrough();

    //     service.onKeyEscape(keyEvent);
    //     expect(subscriptionTimerSubscribeSpy).not.toHaveBeenCalled();
    //     expect(subscriptionMoveRightSubscribeSpy).not.toHaveBeenCalled();
    //     expect(subscriptionMoveLeftSubscribeSpy).not.toHaveBeenCalled();
    //     expect(subscriptionMoveUpSubscribeSpy).not.toHaveBeenCalled();
    //     expect(subscriptionMoveDownSubscribeSpy).not.toHaveBeenCalled();
    //     expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    // });

    // it(' onMouseOut should reset the canvas if a selection is being moved', () => {
    //     const mouseEvent = {} as MouseEvent;
    //     service.imageData = baseCtxStub.createImageData(10, 10);
    //     service.inSelection = true;
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     service.mouseDown = true;
    //     service.onMouseOut(mouseEvent);
    //     expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    // });

    // it(' onMouseOut should call on mouse up if a selection is being drawn', () => {
    //     const mouseEvent = {} as MouseEvent;
    //     onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.callThrough();
    //     service.imageData = baseCtxStub.createImageData(10, 10);
    //     service.inSelection = false;
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     service.mouseDown = false;
    //     service.onMouseOut(mouseEvent);
    //     expect(onMouseUpSpy).toHaveBeenCalled();
    // });

    // it(' onShiftKeyDown should reset the preview canvas an draw a preview', () => {
    //     const keyEvent = {} as KeyboardEvent;
    //     service.mouseDown = true;
    //     service.inSelection = false;
    //     service.onShiftKeyDown(keyEvent);
    //     expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    //     expect(drawPreviewSpy).toHaveBeenCalled();
    // });

    // it(' onShiftKeyDown should not reset the preview canvas an draw a preview if the mouse button is not pressed', () => {
    //     const keyEvent = {} as KeyboardEvent;
    //     service.mouseDown = false;
    //     service.inSelection = false;
    //     service.onShiftKeyDown(keyEvent);
    //     expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    //     expect(drawPreviewSpy).not.toHaveBeenCalled();
    // });

    // it(' onShiftKeyUp should reset the preview canvas an draw a preview', () => {
    //     const keyEvent = {} as KeyboardEvent;
    //     service.mouseDown = true;
    //     service.inSelection = false;
    //     service.onShiftKeyUp(keyEvent);
    //     expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    //     expect(drawPreviewSpy).toHaveBeenCalled();
    // });

    // it(' onShiftKeyUp should not reset the preview canvas an draw a preview the mouse button is not pressed', () => {
    //     const keyEvent = {} as KeyboardEvent;
    //     service.mouseDown = false;
    //     service.inSelection = false;
    //     service.onShiftKeyUp(keyEvent);
    //     expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    //     expect(drawPreviewSpy).not.toHaveBeenCalled();
    // });

    // it(' clearEffectTool should reset drawing effects on canvas', () => {
    //     service.clearEffectTool();
    //     expect(service['drawingService'].previewCtx.lineCap).toEqual('square');
    // });

    // it(' selectAll should draw a selection of the entire canvas', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.selectAll();
    //     expect(drawSelectionSpy).toHaveBeenCalled();
    // });

    // it(' drawPreviewRect should draw a preview square if shift is pressed in the preview canvas', () => {
    //     service.startingPos = { x: 1, y: 1 };
    //     service.endingPos = { x: 30, y: 20 };
    //     service.drawPreviewRect(service['drawingService'].previewCtx, true);

    //     expect(service.width).toEqual(19);
    //     expect(service.height).toEqual(19);
    // });

    // it(' drawPreviewRect should draw a preview rectangle in the preview canvas', () => {
    //     service.startingPos = { x: 1, y: 1 };
    //     service.endingPos = { x: 30, y: 20 };
    //     service.drawPreviewRect(service['drawingService'].previewCtx, false);

    //     expect(service.width).toEqual(29);
    //     expect(service.height).toEqual(19);
    // });

    // it(' drawSelectionRect should draw a selection rectangle in the preview canvas', () => {
    //     service.width = 20;
    //     service.height = 20;
    //     fillRectSpy = spyOn<any>(service['drawingService'].previewCtx, 'fillRect').and.callThrough();
    //     service.drawSelectionRect({ x: 1, y: 1 }, 10, 10);
    //     expect(fillRectSpy).toHaveBeenCalled();
    // });

    // it(' copySelection should get the imageData of a selection and return the image starting position', () => {
    //     service.width = 20;
    //     service.height = 20;
    //     service.startingPos = { x: 1, y: 1 };
    //     service.endingPos = { x: 20, y: 20 };
    //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
    //     expect(service.copySelection()).toEqual({ x: 1, y: 1 });
    //     expect(getImageDataSpy).toHaveBeenCalled();
    // });

    // it(' copySelection should get the imageData of a selectionand return the image starting position', () => {
    //     service.width = 20;
    //     service.height = 20;
    //     service.startingPos = { x: 20, y: 1 };
    //     service.endingPos = { x: 1, y: 20 };
    //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
    //     expect(service.copySelection()).toEqual({ x: 1, y: 1 });
    //     expect(getImageDataSpy).toHaveBeenCalled();
    // });

    // it(' copySelection should get the imageData of a selectionand return the image starting position', () => {
    //     service.width = 20;
    //     service.height = 20;
    //     service.startingPos = { x: 1, y: 20 };
    //     service.endingPos = { x: 20, y: 1 };
    //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
    //     expect(service.copySelection()).toEqual({ x: 1, y: 1 });
    //     expect(getImageDataSpy).toHaveBeenCalled();
    // });

    // it(' copySelection should get the imageData of a selectionand return the image starting position', () => {
    //     service.width = 20;
    //     service.height = 20;
    //     service.startingPos = { x: 20, y: 20 };
    //     service.endingPos = { x: 1, y: 1 };
    //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
    //     expect(service.copySelection()).toEqual({ x: 1, y: 1 });
    //     expect(getImageDataSpy).toHaveBeenCalled();
    // });

    // it(' isInsideSelection should return if the mouse position is inside a selection', () => {
    //     service.startingPos = { x: 1, y: 1 };
    //     service.endingPos = { x: 20, y: 20 };
    //     expect(service.isInsideSelection({ x: 10, y: 10 })).toEqual(true);
    // });

    // it(' isInsideSelection should return if the mouse position is inside a selection', () => {
    //     service.startingPos = { x: 0, y: 0 };
    //     service.endingPos = { x: 20, y: 20 };
    //     expect(service.isInsideSelection({ x: 10, y: 10 })).toEqual(false);
    // });

    // it(' onLeftArrow should draw a selection with 3px mouvement', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.width = 20;
    //     service.height = 20;
    //     service.leftArrow.arrowPressed = false;
    //     service.time = 550;
    //     service.timerStarted = true;
    //     service.onLeftArrow();

    //     expect(drawSelectionSpy).toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).toHaveBeenCalled();
    // });

    // it(' onLeftArrow should not draw a selection with 3px mouvement if the preview canvas is blank', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
    //     service.leftArrow.arrowPressed = false;
    //     service.time = 400;
    //     service.timerStarted = true;
    //     service.onLeftArrow();

    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).not.toHaveBeenCalled();
    // });

    // it(' onLeftArrow should NOT draw a selection with 3px mouvement if the left arrow is not pressed', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.width = 20;
    //     service.height = 20;
    //     service.leftArrow.arrowPressed = true;
    //     service.time = 400;
    //     service.timerStarted = true;
    //     service.onLeftArrow();

    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).not.toHaveBeenCalled();
    // });

    // it(' onRightArrow should draw a selection with 3px mouvement', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerRightSpy = spyOn<any>(service, 'moveSelectiontimerRight').and.callThrough();

    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.width = 20;
    //     service.height = 20;
    //     service.rightArrow.arrowPressed = false;
    //     service.timerStarted = true;
    //     service.time = 550;
    //     service.onRightArrow();

    //     expect(drawSelectionSpy).toHaveBeenCalled();
    //     expect(moveSelectiontimerRightSpy).toHaveBeenCalled();
    // });

    // it(' onRightArrow should not draw a selection with 3px mouvement if the preview canvas is blank', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
    //     service.rightArrow.arrowPressed = false;
    //     service.time = 400;
    //     service.timerStarted = true;
    //     service.onRightArrow();

    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).not.toHaveBeenCalled();
    // });

    // it(' onRightArrow should NOT draw a selection with 3px mouvement if the left arrow is not pressed', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.width = 20;
    //     service.height = 20;
    //     service.rightArrow.arrowPressed = true;
    //     service.time = 400;
    //     service.timerStarted = true;
    //     service.onRightArrow();

    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).not.toHaveBeenCalled();
    // });

    // it(' onUpArrow should draw a selection with 3px mouvement', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerUpSpy = spyOn<any>(service, 'moveSelectiontimerUp').and.callThrough();

    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.width = 20;
    //     service.height = 20;
    //     service.upArrow.arrowPressed = false;
    //     service.timerStarted = true;
    //     service.time = 550;
    //     service.onUpArrow();

    //     expect(drawSelectionSpy).toHaveBeenCalled();
    //     expect(moveSelectiontimerUpSpy).toHaveBeenCalled();
    // });

    // it(' onUpArrow should not draw a selection with 3px mouvement if the preview canvas is blank', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
    //     service.upArrow.arrowPressed = false;
    //     service.time = 400;
    //     service.timerStarted = true;
    //     service.onUpArrow();

    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).not.toHaveBeenCalled();
    // });

    // it(' onUpArrow should NOT draw a selection with 3px mouvement if the left arrow is not pressed', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.width = 20;
    //     service.height = 20;
    //     service.upArrow.arrowPressed = true;
    //     service.time = 400;
    //     service.timerStarted = true;
    //     service.onUpArrow();

    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).not.toHaveBeenCalled();
    // });

    // it(' onDownArrow should draw a selection with 3px mouvement', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerDownSpy = spyOn<any>(service, 'moveSelectiontimerDown').and.callThrough();

    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.width = 20;
    //     service.height = 20;
    //     service.downArrow.arrowPressed = false;
    //     service.timerStarted = true;
    //     service.time = 550;
    //     service.onDownArrow();

    //     expect(drawSelectionSpy).toHaveBeenCalled();
    //     expect(moveSelectiontimerDownSpy).toHaveBeenCalled();
    // });

    // it(' onDownArrow should not draw a selection with 3px mouvement if the preview canvas is blank', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(true);
    //     service.downArrow.arrowPressed = false;
    //     service.time = 400;
    //     service.timerStarted = true;
    //     service.onDownArrow();

    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).not.toHaveBeenCalled();
    // });

    // it(' onDownArrow should NOT draw a selection with 3px mouvement if the left arrow is not pressed', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.copyImageInitialPos = { x: 1, y: 1 };
    //     drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    //     service.width = 20;
    //     service.height = 20;
    //     service.downArrow.arrowPressed = true;
    //     service.time = 400;
    //     service.timerStarted = true;
    //     service.onDownArrow();

    //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    //     expect(moveSelectiontimerLeftSpy).not.toHaveBeenCalled();
    // });

    // it(' startTimer should start a timer if its not already started', () => {
    //     service.timerStarted = false;
    //     service.startTimer();
    //     expect(service.timerStarted).toEqual(true);
    // });

    // it(' startTimer should not start a timer if its already started', () => {
    //     service.timerStarted = true;
    //     service.startTimer();
    //     expect(service.timerStarted).toEqual(true);
    // });

    // it(' moveSelectiontimerLeft should move a selection by 3px every 100ms', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.leftArrow.timerStarted = false;
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.moveSelectiontimerLeft();
    //     expect(service.leftArrow.timerStarted).toEqual(true);
    // });

    // it(' moveSelectiontimerLeft should not move a selection if it already did once', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.leftArrow.timerStarted = true;
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.moveSelectiontimerLeft();
    //     expect(service.leftArrow.timerStarted).toEqual(true);
    // });

    // it(' moveSelectiontimerRight should move a selection by 3px every 100ms', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.rightArrow.timerStarted = false;
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.moveSelectiontimerRight();
    //     expect(service.rightArrow.timerStarted).toEqual(true);
    // });

    // it(' moveSelectiontimerRight should not move a selection if it already did once', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.rightArrow.timerStarted = true;
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.moveSelectiontimerRight();
    //     expect(service.rightArrow.timerStarted).toEqual(true);
    // });

    // it(' moveSelectiontimerUp should move a selection by 3px every 100ms', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.upArrow.timerStarted = false;
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.moveSelectiontimerUp();
    //     expect(service.upArrow.timerStarted).toEqual(true);
    // });

    // it(' moveSelectiontimerUp should not move a selection if it already did once', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.upArrow.timerStarted = true;
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.moveSelectiontimerUp();
    //     expect(service.upArrow.timerStarted).toEqual(true);
    // });

    // it(' moveSelectiontimerDown should move a selection by 3px every 100ms', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.downArrow.timerStarted = false;
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.moveSelectiontimerDown();
    //     expect(service.downArrow.timerStarted).toEqual(true);
    // });

    // it(' moveSelectiontimerDown should not move a selection if it already did once', () => {
    //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    //     service.downArrow.timerStarted = true;
    //     service.mouseMouvement = { x: 10, y: 10 };
    //     service.moveSelectiontimerDown();
    //     expect(service.downArrow.timerStarted).toEqual(true);
    // });

    // it(' resetTimer should reset the main timer if no arrows are pressed', () => {
    //     service.rightArrow.arrowPressed = false;
    //     service.leftArrow.arrowPressed = false;
    //     service.upArrow.arrowPressed = false;
    //     service.downArrow.arrowPressed = false;
    //     service.timerStarted = true;
    //     service.subscriptionTimer = new Subscription();
    //     subscriptionTimerSubscribeSpy = spyOn<any>(service.subscriptionTimer, 'unsubscribe').and.callThrough();
    //     service.resetTimer();
    //     expect(subscriptionTimerSubscribeSpy).toHaveBeenCalled();
    // });

    // it(' resetTimer should not reset the main timer if some arrows are pressed', () => {
    //     service.rightArrow.arrowPressed = true;
    //     service.leftArrow.arrowPressed = false;
    //     service.upArrow.arrowPressed = false;
    //     service.downArrow.arrowPressed = false;
    //     service.timerStarted = true;
    //     service.subscriptionTimer = new Subscription();
    //     subscriptionTimerSubscribeSpy = spyOn<any>(service.subscriptionTimer, 'unsubscribe').and.callThrough();
    //     service.resetTimer();
    //     expect(subscriptionTimerSubscribeSpy).not.toHaveBeenCalled();
    // });
});
