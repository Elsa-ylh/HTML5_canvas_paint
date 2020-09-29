import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from './brush.service';

// tslint:disable:no-any
describe('BrushService', () => {
    let service: BrushService;
    let mouseEvent: MouseEvent;
    let mouseEvent1: MouseEvent;
    let mouseEventRight: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let subToolselected: SubToolselected;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let drawBrushToolSpy: jasmine.Spy<any>;
    let drawLineBrushSpy: jasmine.Spy<any>;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        subToolselected = SubToolselected.tool2;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(BrushService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        drawBrushToolSpy = spyOn<any>(service, 'drawBrushTool4').and.callThrough();
        drawLineBrushSpy = spyOn<any>(service, 'drawLineBrush5').and.callThrough();
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 10,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEvent1 = {
            offsetX: 25,
            offsetY: 12,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEventRight = {
            offsetX: 10,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
    });

    it('should be created', inject([BrushService], (serviceRec: BrushService) => {
        expect(serviceRec).toBeTruthy();
    }));

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 10 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });
    it(' mouseDown should set mouseDown property to true on left click and right click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });
    it(' mouseDown should set mouseDown property to false on  right click', () => {
        service.onMouseDown(mouseEventRight);
        expect(service.mouseDown).toEqual(false);
    });
    it('switch  brush tool 1', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool1);
    });
    it('switch  brush tool 2', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.subToolSelect = subToolselected;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(subToolselected);
    });
    it('switch  brush tool 3', () => {
        service.subToolSelect = SubToolselected.tool3;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool3);
    });
    it('switch  brush tool 4', () => {
        service.subToolSelect = SubToolselected.tool4;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool4);
    });
    it('switch  brush tool 5', () => {
        service.subToolSelect = SubToolselected.tool5;
        service.onMouseDown(mouseEvent);
        expect(service.subToolSelect).toEqual(SubToolselected.tool5);
    });
    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call drawBrushToolSpy if mouse was already down tool4', () => {
        service.subToolSelect = SubToolselected.tool4;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawBrushToolSpy).toHaveBeenCalled();
    });

    it(' onMouseMove and onMouseUp should call drawBrushToolSpy if mouse was already down tool4', () => {
        service.subToolSelect = SubToolselected.tool4;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawBrushToolSpy).toHaveBeenCalled();
    });

    it('onMouseMove and onMouseUp should call drawLineBrushSpy if mouse was already down tool5 ', () => {
        service.subToolSelect = SubToolselected.tool5;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawLineBrushSpy).toHaveBeenCalled();
    });

    it('onMouseMove and onMouseUp should call drawLineSpy if mouse was already down 6 si def', () => {
        const tool6 = 6; // tools exite pas
        service.subToolSelect = tool6;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('onMouseMove and onMouseUp should call drawLineSpy if mouse was already down 3', () => {
        service.subToolSelect = SubToolselected.tool3;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('onMouseMove and onMouseUp should call drawLineSpy if mouse was already down 2', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('onMouseDown and onMouseUp should call drawLineSpy if mouse was already down 3', () => {
        service.subToolSelect = SubToolselected.tool3;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent1);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
});
