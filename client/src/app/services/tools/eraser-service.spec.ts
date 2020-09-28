import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser-service';

// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let mouseEvent1: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let fillRectSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let removeLineSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EraserService);
        removeLineSpy = spyOn<any>(service, 'RemoveLine').and.callThrough();
        fillRectSpy = spyOn<any>(baseCtxStub, 'fillRect').and.callThrough();
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 10,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEvent1 = {
            offsetX: 8,
            offsetY: 35,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', inject([EraserService], (serviceEr: EraserService) => {
        expect(serviceEr).toBeTruthy();
    }));

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 10, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 8,
            offsetY: 35,
            button: MouseButton.Middle, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should not call eraseLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(removeLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call eraseLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent1);
        service.onMouseUp(mouseEvent);
        expect(removeLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call eraseLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(removeLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(removeLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(removeLineSpy).not.toHaveBeenCalled();
    });
});
