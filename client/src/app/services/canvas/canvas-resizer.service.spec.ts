/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { EventOfTest } from '@app/classes/event-of-test';
import { ResizeDirection } from '@app/classes/resize-direction';
import { CanvasResizerService } from './canvas-resizer.service';

describe('Service: CanvasResizer', () => {
    // tslint:disable-next-line: no-any
    let changeResizeYSpy: jasmine.Spy<any>;
    // tslint:disable-next-line: no-any
    let changeResizeXSpy: jasmine.Spy<any>;
    let canvasResizerService: CanvasResizerService;
    let baseCtxStub: CanvasRenderingContext2D;
    let conparativectxStub: CanvasRenderingContext2D;
    let events: EventOfTest;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        conparativectxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [CanvasResizerService],
        });

        canvasResizerService = TestBed.inject(CanvasResizerService);
        baseCtxStub.fillStyle = 'white';
        baseCtxStub.fillRect(0, 0, canvasResizerService.MIN_CANVAS_SIZE, canvasResizerService.MIN_CANVAS_SIZE);
        conparativectxStub.fillStyle = 'white';
        conparativectxStub.fillRect(0, 0, canvasResizerService.MIN_CANVAS_SIZE, canvasResizerService.MIN_CANVAS_SIZE);

        /* clearCanvasSpy = spyOn<any>(canvasResizerService, 'clearCanvas').and.callThrough();
        changeCanvasYSpy = spyOn<any>(canvasResizerService, 'changeCanvasY').and.callThrough();
        changeCanvasXSpy = spyOn<any>(canvasResizerService, 'changeCanvasX').and.callThrough();
        */
        // tslint:disable-next-line: no-any
        changeResizeXSpy = spyOn<any>(canvasResizerService, 'changeResizeX').and.callThrough();
        // tslint:disable-next-line: no-any
        changeResizeYSpy = spyOn<any>(canvasResizerService, 'changeResizeY').and.callThrough();
        events = new EventOfTest();
        canvasResizerService.resizeDirection = ResizeDirection.vertical;
    });

    it('should creer', inject([CanvasResizerService], (service: CanvasResizerService) => {
        expect(service).toBeTruthy();
    }));
    it('should onResizeDown horizontal', () => {
        canvasResizerService.onResizeDown(events.mouseEvent, ResizeDirection.horizontal);
        expect(canvasResizerService.resizerIndex).toEqual(canvasResizerService.PRIORITY_INDEX);
        expect(canvasResizerService.resizeDirection).toEqual(ResizeDirection.horizontal);
    });
    it('should onResizeDown Right click horizontal', () => {
        canvasResizerService.onResizeDown(events.mouseEventR, ResizeDirection.horizontal);
        expect(canvasResizerService.resizerIndex).toEqual(canvasResizerService.NORMAL_INDEX);
        expect(canvasResizerService.resizeDirection).not.toEqual(ResizeDirection.horizontal);
    });
    it('should onResizeDown vertical', () => {
        canvasResizerService.onResizeDown(events.mouseEvent, ResizeDirection.vertical);
        expect(canvasResizerService.resizerIndex).toEqual(canvasResizerService.PRIORITY_INDEX);
        expect(canvasResizerService.resizeDirection).toEqual(ResizeDirection.vertical);
    });
    it('should onResizeDown verticalAndHorizontal', () => {
        canvasResizerService.onResizeDown(events.mouseEvent, ResizeDirection.verticalAndHorizontal);
        expect(canvasResizerService.resizerIndex).toEqual(canvasResizerService.PRIORITY_INDEX);
        expect(canvasResizerService.resizeDirection).toEqual(ResizeDirection.verticalAndHorizontal);
    });
    it('changeResizeY is MIN_CANVAS_SIZE', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEvent2, canvasResizerService);
        expect(numberResult).toEqual(canvasResizerService.MIN_CANVAS_SIZE);
    });
    it('changeResizeX is MIN_CANVAS_SIZE', () => {
        const numberResult: number = changeResizeXSpy(events.mouseEvent2, canvasResizerService);
        expect(numberResult).toEqual(canvasResizerService.MIN_CANVAS_SIZE);
    });
    it('changeResizeY is ouverSize', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEventOutSate, canvasResizerService);
        expect(numberResult).toEqual(canvasResizerService.resizeHeight - canvasResizerService.WORK_AREA_PADDING_SIZE);
    });
    it('changeResizeX is ouverSize', () => {
        const numberResult: number = changeResizeXSpy(events.mouseEventOutSate, canvasResizerService);
        expect(numberResult).toEqual(canvasResizerService.resizeWidth - canvasResizerService.WORK_AREA_PADDING_SIZE);
    });
    it('changeResizeY is good size', () => {
        const numberResult: number = changeResizeYSpy(events.mouseEventX499Y500, canvasResizerService);
        expect(numberResult).toEqual(events.mouseEventX499Y500.offsetY);
    });
    // it('changeResizeX is good size', () => {
    //    const numberResult: number = changeResizeXSpy(events.mouseEventX499Y500, canvasResizerService);
    //    expect(numberResult).toEqual(events.mouseEventX499Y500.offsetX);
    // });
    it('onResize is good vertical', () => {
        canvasResizerService.resizeDirection = ResizeDirection.vertical;
        canvasResizerService.onResize(events.mouseEventX499Y500, baseCtxStub);
        // expect(baseCtxStub).not.toEqual(conparativectxStub);
    });
    it('onResize is good horizontal', () => {
        canvasResizerService.resizeDirection = ResizeDirection.horizontal;
        canvasResizerService.onResize(events.mouseEventX499Y500, baseCtxStub);
        // expect(baseCtxStub).not.toEqual(conparativectxStub);
    });
    it('onResize is good verticalAndHorizontal', () => {
        canvasResizerService.resizeDirection = ResizeDirection.verticalAndHorizontal;
        canvasResizerService.onResize(events.mouseEventX499Y500, baseCtxStub);
        // expect(baseCtxStub).not.toEqual(conparativectxStub);
    });
});
