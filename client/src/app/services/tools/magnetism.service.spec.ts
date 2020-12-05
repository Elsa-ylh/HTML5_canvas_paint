/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '../canvas/canvas-resizer.service';
import { DrawingService } from '../drawing/drawing.service';
import { GridService } from './grid.service';
import { MagnetismParams, MagnetismService } from './magnetism.service';

let service: MagnetismService;

let gridStub: GridService;
let canvasResizerStub: CanvasResizerService;
let drawingStub: DrawingService;

let baseCtxStub: CanvasRenderingContext2D;
let previewCtxStub: CanvasRenderingContext2D;

let ajustedPosition: Vec2;
let selectionSize: Vec2;

fdescribe('Service: Magnetism', () => {
    beforeEach(() => {
        drawingStub = new DrawingService();
        gridStub = new GridService(drawingStub, canvasResizerStub);

        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridStub }],
        });
        service = TestBed.inject(MagnetismService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        const gridCanvas = document.createElement('canvas');
        const largeCanvasSize = 1000;
        gridCanvas.width = largeCanvasSize;
        gridCanvas.height = largeCanvasSize;

        const gridCtxStub = gridCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub['canvas'] = canvasTestHelper.canvas;
        drawingStub['gridCanvas'] = gridCanvas;

        drawingStub['baseCtx'] = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        drawingStub['previewCtx'] = previewCtxStub;
        drawingStub['gridCtx'] = gridCtxStub;

        ajustedPosition = { x: 200, y: 200 } as Vec2;
        selectionSize = { x: 50, y: 50 } as Vec2;
    });

    it('should magnetismService exist', () => {
        expect(service).toBeTruthy();
    });

    it('should convert to position center', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.center, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 175, y: 175 } as Vec2);
    });

    it('should convert to position top left', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.topLeft, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 200, y: 200 } as Vec2);
    });

    it('should convert to position top', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.top, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 175, y: 200 } as Vec2);
    });

    it('should convert to position top right', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.topRight, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 150, y: 200 } as Vec2);
    });

    it('should convert to position left', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.left, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 200, y: 175 } as Vec2);
    });

    it('should convert to position right', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.right, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 150, y: 175 } as Vec2);
    });

    it('should convert to position bottom left', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.bottomLeft, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 150, y: 150 } as Vec2);
    });

    it('should convert to position bottom', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.bottom, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 175, y: 150 } as Vec2);
    });

    it('should convert to position bottom right', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.bottomRight, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({ x: 200, y: 150 } as Vec2);
    });

    it('should convert to position NONE', () => {
        const spy = spyOn<any>(service, 'convertCalculatingPosition').and.callThrough();
        const returnValue = service['convertCalculatingPosition'](ajustedPosition, ControlPointName.none, selectionSize);
        expect(spy).toHaveBeenCalled();
        expect(returnValue).toEqual({} as Vec2);
    });

    it('should calculate remainder when position is below half and equal of the squareWidth', () => {
        const squareWidth = 100;
        const calculatingPosition = { x: 500, y: 500 } as Vec2;
        const spy = spyOn<any>(service, 'calculateRemainder').and.callThrough();
        service['calculateRemainder'](squareWidth, calculatingPosition);
        expect(spy).toHaveBeenCalled();
        expect(service['ajustedPosition']).toEqual({ x: 500, y: 500 } as Vec2);
    });

    it('should calculate remainder when position is above the squareWidth', () => {
        const squareWidth = 100;
        const calculatingPosition = { x: 555, y: 555 } as Vec2;
        const spy = spyOn<any>(service, 'calculateRemainder').and.callThrough();
        service['calculateRemainder'](squareWidth, calculatingPosition);
        expect(spy).toHaveBeenCalled();
        expect(service['ajustedPosition']).toEqual({ x: 600, y: 600 } as Vec2);
    });

    it('should apply final position for selectionService', () => {
        service['ajustedPosition'] = { x: 50, y: 50 } as Vec2;
        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: {} as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;
        const spy = spyOn<any>(service, 'applyFinalPosition').and.callThrough();
        service['applyFinalPosition'](params);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply magnetism on mouse move', () => {
        service.isMagnetismActive = true;
        const params = {
            imagePosition: { x: 100, y: 100 } as Vec2,
            endingPosition: { x: 300, y: 300 } as Vec2,
            controlGroup: {} as ControlGroup,
            selectionSize: { x: 200, y: 200 } as Vec2,
        } as MagnetismParams;
        const spy = spyOn<any>();
    });
});
