/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';

describe('Service: Rectangle', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let shiftEvent: KeyboardEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let subToolselected: SubToolselected;
    //let drawRectangle: jasmine.SpyObj<RectangleService>;
    let drawFillRectangleSpy: jasmine.Spy<any>;
    let drawRectangleOutlineSpy: jasmine.Spy<any>;
    let drawFillRectangleOutlineSpy: jasmine.Spy<any>;
    // let selectRectangleSpy: jasmine.Spy<any>;

    // let drawLineBrush: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        // drawRectangle = jasmine.createSpyObj('RectangleService', ['drawFillRectangle', 'drawRectangleOutline', 'drawFillRectangleOutline']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(RectangleService);
        drawFillRectangleSpy = spyOn<any>(service, 'drawFillRectangle').and.callThrough();
        drawRectangleOutlineSpy = spyOn<any>(service, 'drawRectangleOutline').and.callThrough();
        drawFillRectangleOutlineSpy = spyOn<any>(service, 'drawFillRectangleOutline').and.callThrough();
        // selectRectangleSpy = spyOn<any>(service, 'drawFillRectangleOutline').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        shiftEvent = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
    });

    it('should be created', inject([RectangleService], (serviceRec: RectangleService) => {
        expect(serviceRec).toBeTruthy();
    }));

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it('switch  rectangle tool 1', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool1);
    });
    it('switch  rectangle tool 2', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.subToolSelect = subToolselected;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(subToolselected);
    });
    it('switch  rectangle tool 3', () => {
        service.subToolSelect = SubToolselected.tool3;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool3);
    });

    it(' onMouseUp should call drawFillRectangle if mouse was already down and tool1 selected', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        //expect(drawRectangle.drawFillRectangle).toHaveBeenCalled();
        expect(drawFillRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call drawFillRectangle if mouse was already down and tool2 selected', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        //expect(drawRectangle.drawRectangleOutline).toHaveBeenCalled();
        expect(drawRectangleOutlineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call drawFillRectangle if mouse was already down and tool3 selected', () => {
        service.subToolSelect = SubToolselected.tool3;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        // expect(drawRectangle.drawFillRectangleOutline).toHaveBeenCalled();
        expect(drawFillRectangleOutlineSpy).toHaveBeenCalled();
    });

    it(' pressing shift should change square value to true', () => {
        service.onMouseDown(mouseEvent);
        service.OnShiftKeyDown(shiftEvent);
        expect(service.square).toEqual(true);
    });

    it(' onMouseMove should call drawFillRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.subToolSelect = SubToolselected.tool1;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        // expect(drawRectangle.drawFillRectangle).toHaveBeenCalled();
        expect(drawFillRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawFillRectangle if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        // expect(drawRectangle.drawFillRectangle).not.toHaveBeenCalled();
        expect(drawFillRectangleSpy).not.toHaveBeenCalled();
    });

    // it(' onShiftKeyUp should call drawFillRectangle if mouse was already down', () => {
    //     service.mouseDownCoord = { x: 0, y: 0 };
    //     service.leftMouseDown = true;
    //     service.mouseDown = true;
    //     service.subToolSelect = SubToolselected.tool1;

    //     service.onMouseMove(mouseEvent);
    //     service.OnShiftKeyUp(shiftEvent);
    //     expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    //     // expect(drawRectangle.drawFillRectangle).toHaveBeenCalled();
    //     expect(drawFillRectangleSpy).not.toHaveBeenCalled();
    // });

    it(' onShiftKeyUp should not call drawFillRectangle if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.leftMouseDown = false;

        service.onMouseMove(mouseEvent);
        service.OnShiftKeyUp(shiftEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        //expect(drawRectangle.drawFillRectangle).not.toHaveBeenCalled();
        expect(drawFillRectangleSpy).not.toHaveBeenCalled();
    });
});
