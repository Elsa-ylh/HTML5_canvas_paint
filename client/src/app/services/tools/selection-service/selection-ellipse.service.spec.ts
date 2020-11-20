/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { Subscription } from 'rxjs';
import { SelectionEllipseService } from './selection-ellipse.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:max-file-line-count
// tslint:disable:no-shadowed-variable
describe('Service: SelectionRectangle', () => {
    let service: SelectionEllipseService;
    // let mouseEvent: MouseEvent;

    // let drawSelectionSpy: jasmine.Spy<any>;
    // let pasteSelectionSpy: jasmine.Spy<any>;
    // let getImageDataSpy: jasmine.Spy<any>;
    // let drawSelectionRectSpy: jasmine.Spy<any>;
    // let putImageDataSpy: jasmine.Spy<any>;
    // let drawEllipseSpy: jasmine.Spy<any>;
    // let drawImageSpy: jasmine.Spy<any>;
    // let ellipseSpy: jasmine.Spy<any>;
    // let fillRectSpy: jasmine.Spy<any>;
    // let isInsideSelectionSpy: jasmine.Spy<any>;
    // let getPositionFromMouseSpy: jasmine.Spy<any>;
    // let clearSelectionSpy: jasmine.Spy<any>;

    // let pasteArrowSelectionSpy: jasmine.Spy<any>;
    // let subscriptionMoveLeftSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveRightSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveUpSubscribeSpy: jasmine.Spy<any>;
    // let subscriptionMoveDownSubscribeSpy: jasmine.Spy<any>;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'isPreviewCanvasBlank']);
        TestBed.configureTestingModule({
            providers: [SelectionEllipseService, { provide: DrawingService, useValue: drawServiceSpy }],
        });

        service = TestBed.inject(SelectionEllipseService);

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas as HTMLCanvasElement;

        // getPositionFromMouseSpy = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        // isInsideSelectionSpy = spyOn<any>(service, 'isInsideSelection').and.callThrough();
    });

    it('should be created', inject([SelectionEllipseService], (service: SelectionEllipseService) => {
        expect(service).toBeTruthy();
    }));

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

    // // it(' onMouseUp should copy a selection and draw it in the preview canvas', () => {
    // //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    // //     const imageDataMock = new ImageData(10, 10) as ImageData;
    // //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

    // //     mouseEvent = {
    // //         button: 0,
    // //         offsetX: 25,
    // //         offsetY: 25,
    // //     } as MouseEvent;

    // //     service.mouseDownCoord = { x: 1, y: 1 };
    // //     service.shiftPressed = false;
    // //     service.mouseDown = true;

    // //     service.onMouseUp(mouseEvent);
    // //     expect(getImageDataSpy).toHaveBeenCalled();
    // //     expect(drawSelectionSpy).toHaveBeenCalled();
    // // });

    // // it(' onMouseUp should copy a selection and draw it in the preview canvas if shift is pressed', () => {
    // //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    // //     const imageDataMock = new ImageData(10, 10) as ImageData;
    // //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

    // //     mouseEvent = {
    // //         button: 0,
    // //         offsetX: 25,
    // //         offsetY: 25,
    // //     } as MouseEvent;

    // //     service.mouseDownCoord = { x: 1, y: 1 };
    // //     service.shiftPressed = true;
    // //     service.mouseDown = true;

    // //     service.onMouseUp(mouseEvent);
    // //     expect(getImageDataSpy).toHaveBeenCalled();
    // //     expect(drawSelectionSpy).toHaveBeenCalled();
    // // });

    // // it(' onMouseUp should not copy a selection and draw it in the preview canvas if the left mouse button was not pressed', () => {
    // //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    // //     const imageDataMock = new ImageData(10, 10) as ImageData;
    // //     getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(imageDataMock);

    // //     mouseEvent = {
    // //         button: 0,
    // //         offsetX: 25,
    // //         offsetY: 25,
    // //     } as MouseEvent;

    // //     service.mouseDownCoord = { x: 1, y: 1 };
    // //     service.shiftPressed = false;
    // //     service.mouseDown = false;

    // //     service.onMouseUp(mouseEvent);
    // //     expect(getImageDataSpy).not.toHaveBeenCalled();
    // //     expect(drawSelectionSpy).not.toHaveBeenCalled();
    // // });

    // // it(' onMouseUp should paste a selection if a selection has been drawn', () => {
    // //     drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    // //     pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
    // //     service.imageData = new ImageData(10, 10);

    // //     mouseEvent = {
    // //         button: 0,
    // //         offsetX: 25,
    // //         offsetY: 25,
    // //     } as MouseEvent;

    // //     service.mouseDownCoord = { x: 1, y: 1 };
    // //     service.copyImageInitialPos = { x: 1, y: 1 };
    // //     service.mouseMouvement = { x: 10, y: 10 };
    // //     service.inSelection = true;
    // //     service.mouseDown = true;

    // //     service.onMouseUp(mouseEvent);
    // //     expect(pasteSelectionSpy).toHaveBeenCalled();
    // // });

    // it(' drawSelection should draw a selection rectangle and put the image inside it when all the canvas is selected', () => {
    //     drawSelectionRectSpy = spyOn<any>(service, 'drawSelectionRect').and.callThrough();
    //     putImageDataSpy = spyOn<any>(service['drawingService'].previewCtx, 'putImageData').and.callThrough();

    //     service.isAllSelect = true;
    //     service.image = new Image();
    //     service.imageData = new ImageData(10, 10);
    //     service['drawSelection']({ x: 1, y: 1 });
    //     expect(putImageDataSpy).toHaveBeenCalled();
    //     expect(drawSelectionRectSpy).toHaveBeenCalled();
    // });

    // it(' drawSelection should draw a selection rectangle and draw the image inside it', () => {
    //     drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
    //     drawImageSpy = spyOn<any>(service['drawingService'].previewCtx, 'drawImage').and.callThrough();

    //     service.isAllSelect = false;
    //     service.image = new Image();
    //     service.imageData = new ImageData(10, 10);
    //     service['drawSelection']({ x: 1, y: 1 });
    //     expect(drawImageSpy).toHaveBeenCalled();
    //     expect(drawEllipseSpy).toHaveBeenCalled();
    // });

    // it(' pasteSelection should put a selection on the canvas if all the canvas is selected', () => {
    //     putImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'putImageData').and.callThrough();

    //     service.isAllSelect = true;
    //     service.image = new Image();
    //     service.imageData = new ImageData(10, 10);
    //     service.pasteSelection({ x: 1, y: 1 }, service.image, { x: 10, y: 10 });
    //     expect(putImageDataSpy).toHaveBeenCalled();
    // });

    // it(' drawPreview should draw a preview rectangle', () => {
    //     drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();

    //     service.shiftPressed = true;
    //     service.startingPos = { x: 1, y: 1 };
    //     service.endingPos = { x: 10, y: 10 };
    //     service['drawPreview']();
    //     expect(drawEllipseSpy).toHaveBeenCalled();
    // });

    // // it(' drawPreviewEllipse should draw a preview ellipse', () => {
    // //     drawPreviewEllipseSpy = spyOn<any>(service, 'drawPreviewEllipse').and.callThrough();

    // //     service.mouseDownCoord = { x: 1, y: 1 };
    // //     service.mousePosition = { x: 30, y: 20 };
    // //     service.width = 20;
    // //     service.height = 20;
    // //     service.drawPreviewEllipse(service['drawingService'].previewCtx);
    // //     expect(drawPreviewEllipseSpy).toHaveBeenCalled();
    // // });

    // it(' drawEllipse should draw a circle if shift is pressed', () => {
    //     ellipseSpy = spyOn<any>(service['drawingService'].previewCtx, 'ellipse').and.callThrough();

    //     service.width = 20;
    //     service.height = 20;
    //     service.ellipseRad = { x: 2, y: 2 };
    //     service.inSelection = false;
    //     service.shiftPressed = true;

    //     service.drawEllipse(service['drawingService'].previewCtx, { x: 20, y: 20 }, 10, 10);
    //     expect(ellipseSpy).toHaveBeenCalled();
    // });

    // it(' drawEllipse should draw an ellipse', () => {
    //     ellipseSpy = spyOn<any>(service['drawingService'].previewCtx, 'ellipse').and.callThrough();

    //     service.width = 20;
    //     service.height = 20;
    //     service.ellipseRad = { x: 2, y: 2 };
    //     service.inSelection = false;
    //     service.shiftPressed = false;

    //     service.drawEllipse(service['drawingService'].previewCtx, { x: 20, y: 20 }, 10, 10);
    //     expect(ellipseSpy).toHaveBeenCalled();
    // });

    // it(' clearSelection should put a white rectangle over a selection initial position and all the canvas is selected', () => {
    //     fillRectSpy = spyOn<any>(service['drawingService'].baseCtx, 'fillRect').and.callThrough();
    //     service.isAllSelect = true;
    //     service['clearSelection']({ x: 1, y: 1 }, 10, 10);
    //     expect(fillRectSpy).toHaveBeenCalled();
    // });

    // it(' clearSelection should put a white ellipse over a selection initial position', () => {
    //     drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
    //     service.isAllSelect = false;
    //     service['clearSelection']({ x: 1, y: 1 }, 10, 10);
    //     expect(drawEllipseSpy).toHaveBeenCalled();
    // });

    // // it(' pasteArrowSelection should paste a selection moved with the arrow keys', () => {
    // //     pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
    // //     clearSelectionSpy = spyOn<any>(service, 'clearSelection').and.callThrough();

    // //     service.timerStarted = false;
    // //     service.mouseMouvement = { x: 5, y: 5 };
    // //     service.width = 10;
    // //     service.height = 10;
    // //     service.image = new Image();
    // //     service.imageData = new ImageData(10, 10);

    // //     service.pasteArrowSelection();
    // //     expect(clearSelectionSpy).toHaveBeenCalled();
    // //     expect(pasteSelectionSpy).toHaveBeenCalled();
    // // });

    // // it(' pasteArrowSelection should not paste a selection if it wasnt move with the arrow keys', () => {
    // //     pasteSelectionSpy = spyOn<any>(service, 'pasteSelection').and.callThrough();
    // //     clearSelectionSpy = spyOn<any>(service, 'clearSelection').and.callThrough();

    // //     service.timerStarted = true;
    // //     service.mouseMouvement = { x: 5, y: 5 };
    // //     service.width = 10;
    // //     service.height = 10;
    // //     service.imageData = new ImageData(10, 10);

    // //     service.pasteArrowSelection();
    // //     expect(clearSelectionSpy).not.toHaveBeenCalled();
    // //     expect(pasteSelectionSpy).not.toHaveBeenCalled();
    // // });

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
