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
    let strokeRectSpy: jasmine.Spy<any>;
    let controlGroupDrawSpy: jasmine.Spy<any>;
    let selectionGetImageSpy: jasmine.Spy<any>;
    let selectionGetImageURLSpy: jasmine.Spy<any>;
    let onArrowDownSpy: jasmine.Spy<any>;
    let onArrowUpSpy: jasmine.Spy<any>;

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

    it(' onShiftKeyUp should redraw the preview selection with the appropriate size', () => {
        drawPreviewSpy = spyOn<any>(service, 'drawPreview');
        const keyEvent = {} as KeyboardEvent;

        service.mouseDown = true;
        service['inSelection'] = false;
        service['controlPointName'] = ControlPointName.none;
        service['controlGroup'] = new ControlGroup(service['drawingService']);
        service.onShiftKeyUp(keyEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' clearEffectTool should reset drawing effects on canvas', () => {
        service.clearEffectTool();
        expect(service['drawingService'].previewCtx.lineCap).toEqual('square');
    });

    it(' selectAll should copy a full canvas selection and draw it ', () => {
        copySelectionSpy = spyOn<any>(service, 'copySelection').and.callThrough();
        drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();

        service.selectAll();
        expect(copySelectionSpy).toHaveBeenCalled();
        expect(drawSelectionSpy).toHaveBeenCalled();
    });

    it(' drawPreviewRect should draw a preview rectangle if shift is not pressed ', () => {
        strokeRectSpy = spyOn<any>(service['drawingService'].previewCtx, 'strokeRect').and.callThrough();

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        service['drawPreviewRect'](service['drawingService'].previewCtx, false);
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it(' drawPreviewRect should draw a preview square if shift is not pressed ', () => {
        strokeRectSpy = spyOn<any>(service['drawingService'].previewCtx, 'strokeRect').and.callThrough();

        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        service['drawPreviewRect'](service['drawingService'].previewCtx, true);
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it(' drawSelectionRect should call the get image function and save a base image', () => {
        strokeRectSpy = spyOn<any>(service['drawingService'].previewCtx, 'strokeRect').and.callThrough();

        service['controlGroup'] = new ControlGroup(service['drawingService']);

        controlGroupDrawSpy = spyOn<any>(service['controlGroup'], 'draw');
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        service['drawSelectionRect']({ x: 1, y: 1 }, 10, 10);

        expect(strokeRectSpy).toHaveBeenCalled();
        expect(controlGroupDrawSpy).toHaveBeenCalled();
    });

    it(' copySelection should call the get image function and save a base image', () => {
        selectionGetImageSpy = spyOn<any>(service.selection, 'getImage');
        selectionGetImageURLSpy = spyOn<any>(service.selection, 'getImageURL');
        service.selection.width = 10;
        service.selection.height = 10;
        service.selection.imageData = new ImageData(10, 10);

        service['copySelection']();

        expect(selectionGetImageSpy).toHaveBeenCalled();
        expect(selectionGetImageURLSpy).toHaveBeenCalled();
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection', () => {
        service.selection.imagePosition = { x: 11, y: 1 };
        service.selection.endingPos = { x: 1, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection', () => {
        service.selection.imagePosition = { x: 11, y: 11 };
        service.selection.endingPos = { x: 1, y: 1 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection', () => {
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' updateSelectionPosition should update the selection position to keep imagePosition in the top left and endingPos in the bottom right of the selection', () => {
        service.selection.imagePosition = { x: 1, y: 11 };
        service.selection.endingPos = { x: 11, y: 1 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['updateSelectionPositions']()).toEqual({ x: 1, y: 1 });
    });

    it(' isInsideSelection should check if the mouse coords parameter are in the selection bounds ', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['isInsideSelection']({ x: 5, y: 5 })).toEqual(true);
    });

    it(' isInsideSelection should check if the mouse coords parameter are in the selection bounds ', () => {
        drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
        service.selection.imagePosition = { x: 1, y: 1 };
        service.selection.endingPos = { x: 11, y: 11 };
        service.selection.width = 10;
        service.selection.height = 10;

        expect(service['isInsideSelection']({ x: 15, y: 15 })).toEqual(false);
    });

    it(' onLeftArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowDownSpy = spyOn<any>(service['leftArrow'], 'onArrowDown');
        service.onLeftArrow();
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it(' onRightArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowDownSpy = spyOn<any>(service['rightArrow'], 'onArrowDown');
        service.onRightArrow();
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it(' onUpArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowDownSpy = spyOn<any>(service['upArrow'], 'onArrowDown');
        service.onUpArrow();
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it(' onDownArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowDownSpy = spyOn<any>(service['downArrow'], 'onArrowDown');
        service.onDownArrow();
        expect(onArrowDownSpy).toHaveBeenCalled();
    });
    ///////////////////////////////////////////////////////////
    it(' onLeftArrowUp should call the on arrowDown function of the left arrow ', () => {
        onArrowUpSpy = spyOn<any>(service['leftArrow'], 'onArrowUp');
        service.onLeftArrowUp();
        expect(onArrowUpSpy).toHaveBeenCalled();
    });

    it(' onRightArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowUpSpy = spyOn<any>(service['rightArrow'], 'onArrowUp');
        service.onRightArrowUp();
        expect(onArrowUpSpy).toHaveBeenCalled();
    });

    it(' onUpArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowUpSpy = spyOn<any>(service['upArrow'], 'onArrowUp');
        service.onUpArrowUp();
        expect(onArrowUpSpy).toHaveBeenCalled();
    });

    it(' onDownArrow should call the on arrowDown function of the left arrow ', () => {
        onArrowUpSpy = spyOn<any>(service['downArrow'], 'onArrowUp');
        service.onDownArrowUp();
        expect(onArrowUpSpy).toHaveBeenCalled();
    });
});
