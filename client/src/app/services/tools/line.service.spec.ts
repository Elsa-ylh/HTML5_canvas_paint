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
    let drawLineLastPointSpy: jasmine.Spy<any>;
    let mergeFirstPointSpy: jasmine.Spy<any>;
    let drawLineSpy: jasmine.Spy<any>;
    let shiftDrawAngleLineSpy: jasmine.Spy<any>;
    let clearPathSpy: jasmine.Spy<any>;
    let mouseEvent: MouseEvent;
    let mouseEvent1: MouseEvent;
    let mouseEvent2: MouseEvent;
    let mouseEvent3: MouseEvent;
    let mouseEventR: MouseEvent;
    let drawPoinSpy: jasmine.Spy<any>;
    let backspceEvant: KeyboardEvent;
    const sizeCanvas = 100;
    let ctx: CanvasRenderingContext2D;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawingComponentSpy = jasmine.createSpyObj('DrawingComponent', ['clearCanvas']);
        baseCtxStub.lineWidth = 2;
        previewCtxStub.lineWidth = 2;
        baseCtxStub.strokeStyle = '#000000';
        previewCtxStub.strokeStyle = '#000000';
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, sizeCanvas, sizeCanvas);
        baseCtxStub.putImageData(ctx.getImageData(0, 0, sizeCanvas, sizeCanvas), 0, 0);
        previewCtxStub.putImageData(ctx.getImageData(0, 0, sizeCanvas, sizeCanvas), 0, 0);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: DrawingComponent, useValue: drawingComponentSpy },
            ],
        });

        service = TestBed.inject(LineService);
        drawLineLastPointSpy = spyOn<any>(service, 'drawLineLastPoint').and.callThrough();
        mergeFirstPointSpy = spyOn<any>(service, 'mergeFirstPoint').and.callThrough();
        drawPoinSpy = spyOn<any>(service, 'drawPoin').and.callThrough();
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        shiftDrawAngleLineSpy = spyOn<any>(service, 'shiftDrawAngleLine').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service.subToolSelect = SubToolselected.tool1;
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
        mouseEvent2 = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEvent3 = {
            offsetX: 0,
            offsetY: 10,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEventR = {
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Right,
        } as MouseEvent;
        backspceEvant = new KeyboardEvent('backspace');
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
        expect(drawLineLastPointSpy).not.toHaveBeenCalled();
    });
    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolselected.tool1;
        service.onMouseDown(mouseEvent1);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineLastPointSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.onMouseDown(mouseEventR);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineLastPointSpy).not.toHaveBeenCalled();
    });
    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.onMouseDown(mouseEvent1);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineLastPointSpy).toHaveBeenCalled();
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
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('ShiftDrawAngleLine of 0 ', () => {
        pathData.push({ x: 0, y: 0 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 0 });
        expect(vec2).toEqual({ x: 0, y: 0 });
    });
    it('ShiftDrawAngleLine of 0 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 40 });
        pathData.push({ x: 0, y: 0 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 0 });
        expect(vec2).toEqual({ x: 0, y: 0 });
    });
    it('ShiftDrawAngleLine of angle 135 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 0 });

        expect(vec2).toEqual({ x: 0, y: 0 });
    });

    it('ShiftDrawAngleLine of angle 45 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 100, y: 0 });
        expect(vec2).toEqual({ x: 100, y: 0 });
    });
    it('ShiftDrawAngleLine of angle 180 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 0, y: 50 });
        expect(vec2).toEqual({ x: 0, y: 50 });
    });
    it('ShiftDrawAngleLine of angle 0 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 100, y: 50 });
        expect(vec2).toEqual({ x: 100, y: 50 });
    });
    it('ShiftDrawAngleLine of angle 270 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 50, y: 100 });
        expect(vec2).toEqual({ x: 50, y: 100 });
    });
    it('ShiftDrawAngleLine of angle 225 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 100, y: 0 });
        expect(vec2).toEqual({ x: 100, y: 0 });
    });
    it('ShiftDrawAngleLine of angle 315 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 100, y: 100 });
        expect(vec2).toEqual({ x: 100, y: 100 });
    });
    it('ShiftDrawAngleLine of angle 90 ', () => {
        // tslint:disable-next-line:no-magic-numbers
        pathData.push({ x: 50, y: 50 });
        const vec2 = shiftDrawAngleLineSpy(pathData, { x: 50, y: 0 });
        expect(vec2).toEqual({ x: 50, y: 0 });
    });

    it('backspceEvant fonction if drush in one point', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.onMouseDown(mouseEvent2);
        service.onKeyBackSpace(backspceEvant);
        service.onDoubleClick(mouseEvent);

        const imageData: ImageData = baseCtxStub.getImageData(Math.floor(mouseEvent2.offsetX), Math.floor(mouseEvent2.offsetY), 1, 1);
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[0]).toEqual(63); // R white check
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[1]).toEqual(63); // G white check
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[2]).toEqual(63); // B white check
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('backspceEvant fonction if not drush in second point', () => {
        service.subToolSelect = SubToolselected.tool2;
        service.onMouseDown(mouseEvent1);
        service.onMouseDown(mouseEvent2);
        service.onKeyBackSpace(backspceEvant);
        service.onDoubleClick(mouseEvent);

        const imageData: ImageData = baseCtxStub.getImageData(Math.floor(mouseEvent2.offsetX), Math.floor(mouseEvent2.offsetY), 1, 1);
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[0]).not.toEqual(0); // R white check
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[1]).not.toEqual(0); // G white check
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[2]).not.toEqual(0); // B white check
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });
    it('onMouseDown fonction', () => {
        service.onMouseDown(mouseEvent1);
        service.onMouseDown(mouseEvent2);
        service.onDoubleClick(mouseEvent);

        const imageData: ImageData = baseCtxStub.getImageData(Math.floor(mouseEvent1.offsetX), Math.floor(mouseEvent1.offsetY), 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('onMouseUp should not call drawLineLastPointSpy fonction ', () => {
        service.onMouseUp(mouseEvent2);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });
    it('onKeyEscape should not call clearPath', () => {
        service.onKeyEscape(backspceEvant);
        expect(clearPathSpy).not.toHaveBeenCalled();
    });
    it('onKeyEscape should call clearPath', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyEscape(backspceEvant);
        expect(clearPathSpy).toHaveBeenCalled();
    });
    it('onMouseDown,onMouseMove, OnShiftKeyDown and  onMouseMove and brush ligne in de canvas ', () => {
        service.onMouseDown(mouseEvent1);
        service.onMouseMove(mouseEvent2);
        service.OnShiftKeyDown(backspceEvant);
        service.onMouseMove(mouseEvent3);
        //expect(drawLineLastPointSpy).toHaveBeenCalled();
        const imageData: ImageData = previewCtxStub.getImageData(Math.floor(mouseEvent2.offsetX / 2), Math.floor(mouseEvent2.offsetY / 2), 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });
    it('onMouseDown,onMouseMove, OnShiftKeyDown and onMouseMove OnShiftKeyUp and not brush ligne in de canvas in position of OnShiftKeyDown', () => {
        service.onMouseDown(mouseEvent1);
        service.onMouseMove(mouseEvent2);
        service.OnShiftKeyDown(backspceEvant);
        service.onMouseMove(mouseEvent3);
        service.OnShiftKeyUp(backspceEvant);
        service.onDoubleClick(mouseEvent3);
        const imageData2: ImageData = baseCtxStub.getImageData(Math.floor(mouseEvent2.offsetX / 2), Math.floor(mouseEvent2.offsetY / 2), 1, 1);
        expect(imageData2.data[0]).not.toEqual(0); // R
        expect(imageData2.data[1]).not.toEqual(0); // G
        expect(imageData2.data[2]).not.toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData2.data[3]).not.toEqual(0); // A
    });
    it('onMouseDown,onMouseMove, OnShiftKeyDown, onMouseDown and OnShiftKeyUp and brush ligne in de canvas in position ', () => {
        service.onMouseDown(mouseEvent1);
        service.onMouseMove(mouseEvent2);
        service.OnShiftKeyDown(backspceEvant);
        service.onMouseDown(mouseEvent1);
        service.OnShiftKeyUp(backspceEvant);
        service.onDoubleClick(mouseEvent1);
        const imageData2: ImageData = baseCtxStub.getImageData(Math.floor(mouseEvent2.offsetX / 2), Math.floor(mouseEvent2.offsetY / 2), 1, 1);
        expect(imageData2.data[0]).toEqual(0); // R
        expect(imageData2.data[1]).toEqual(0); // G
        expect(imageData2.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData2.data[3]).not.toEqual(0); // A
    });
    it('OnShiftKeyDown and OnShiftKeyUp not call drawLineLastPoint', () => {
        service.OnShiftKeyDown(backspceEvant);
        service.OnShiftKeyUp(backspceEvant);
        expect(drawLineLastPointSpy).not.toHaveBeenCalled();
    });
});
