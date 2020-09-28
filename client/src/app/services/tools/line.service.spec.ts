/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Vec2 } from '@app/classes/vec2';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';

// tslint:disable:no-any
describe('Service: Line', () => {
    let service: LineService;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let drawingComponentSpy: jasmine.SpyObj<DrawingComponent>;
    let pathData: Vec2[];
    let drawLineSpy: jasmine.Spy<any>;
    let mergeFirstPointSpy: jasmine.Spy<any>;
    let finalDrawLineSpy: jasmine.Spy<any>;
    let shiftDrawAngleLineSpy: jasmine.Spy<any>;

    let mouseEvent: MouseEvent;
    let mouseEvent1: MouseEvent;
    /* let mouseEvent2: MouseEvent; */
    let mouseEventR: MouseEvent;
    let drawPoinSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawingComponentSpy = jasmine.createSpyObj('DrawingComponent', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: DrawingComponent, useValue: drawingComponentSpy },
            ],
        });

        service = TestBed.inject(LineService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        mergeFirstPointSpy = spyOn<any>(service, 'mergeFirstPoint').and.callThrough();
        drawPoinSpy = spyOn<any>(service, 'drawPoin').and.callThrough();
        finalDrawLineSpy = spyOn<any>(service, 'finalDrawLine').and.callThrough();
        shiftDrawAngleLineSpy = spyOn<any>(service, 'shiftDrawAngleLine').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        pathData = [];

        mouseEvent = {
            offsetX: 25,
            offsetY: 10,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEvent1 = {
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Left,
        } as MouseEvent;
        /*mouseEvent2 = {
            offsetX: 10,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;*/
        mouseEventR = {
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Right,
        } as MouseEvent;
    });

    it('should ...', inject([LineService], (serviceRec: LineService) => {
        expect(serviceRec).toBeTruthy();
    }));

    it('one point function mergeFirstPoint si true', () => {
        pathData.push({ x: 25, y: 10 });
        const boolFonction = mergeFirstPointSpy(pathData);
        expect(boolFonction).toEqual(true);
    });
    it('two point function mergeFirstPoint si true', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 45, y: 30 });
        const boolFonction = mergeFirstPointSpy(pathData);
        expect(boolFonction).toEqual(true);
    });
    it('two point function mergeFirstPoint si false', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 46, y: 31 });
        const boolFonction = mergeFirstPointSpy(pathData);
        expect(boolFonction).toEqual(false);
    });
    it('trois point function mergeFirstPoint si true', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 250, y: 100 });
        pathData.push({ x: 45, y: 30 });
        const boolFonction = mergeFirstPointSpy(pathData);
        expect(boolFonction).toEqual(true);
    });

    it('trois point function mergeFirstPoint si false', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 250, y: 100 });
        pathData.push({ x: 46, y: 31 });
        const boolFonction = mergeFirstPointSpy(pathData);
        expect(boolFonction).toEqual(false);
    });
    it('trois point function mergeFirstPoint si x false ', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 250, y: 100 });
        pathData.push({ x: 46, y: 30 });
        const boolFonction = mergeFirstPointSpy(pathData);
        expect(boolFonction).toEqual(false);
    });
    it('trois point function mergeFirstPoint si y false ', () => {
        pathData.push({ x: 25, y: 10 });
        pathData.push({ x: 250, y: 100 });
        pathData.push({ x: 45, y: 31 });
        const boolFonction = mergeFirstPointSpy(pathData);
        expect(boolFonction).toEqual(false);
    });
    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.onMouseDown(mouseEventR);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });
    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.onMouseDown(mouseEvent1);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.onMouseDown(mouseEventR);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });
    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.onMouseDown(mouseEvent1);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should not call draPoint if mouse was not already down', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.onMouseDown(mouseEvent1);

        service.onMouseMove(mouseEvent);
        expect(drawPoinSpy).not.toHaveBeenCalled();
    });
    it(' onMouseMove should call drawPoin if mouse was already down', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.onMouseDown(mouseEvent1);

        service.onMouseMove(mouseEvent);
        expect(drawPoinSpy).toHaveBeenCalled();
    });
    it('doubleClick', () => {
        service.onMouseDown(mouseEvent);
        service.onDoubleClick(mouseEvent1);
        expect(finalDrawLineSpy).toHaveBeenCalled();
    });
    it('ShiftDrawAngleLine of 0 ', () => {
        pathData.push({ x: 0, y: 0 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 0 });
        expect(vec2).toEqual({ x: 0, y: 0 });
    });
    it('ShiftDrawAngleLine of 0 ', () => {
        pathData.push({ x: 50, y: 40 });
        pathData.push({ x: 0, y: 0 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 0 });
        expect(vec2).toEqual({ x: 0, y: 0 });
    });
});
