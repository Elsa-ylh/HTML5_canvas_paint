/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { CanvasResizerService } from './canvas-resizer.service';

describe('Service: CanvasResizer', () => {
    let clearCanvasSpy: jasmine.Spy<any>;
    let changeCanvasYSpy: jasmine.Spy<any>;
    let changeCanvasXSpy: jasmine.Spy<any>;
    let canvasResizerService: CanvasResizerService;
    let baseCtxStub: CanvasRenderingContext2D;
    let conparatifctxStub: CanvasRenderingContext2D;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        conparatifctxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        baseCtxStub.fillStyle = 'white';
        baseCtxStub.fillRect(0, 0, canvasResizerService.MIN_CANVAS_SIZE, canvasResizerService.MIN_CANVAS_SIZE);
        conparatifctxStub.fillStyle = 'white';
        conparatifctxStub.fillRect(0, 0, canvasResizerService.MIN_CANVAS_SIZE, canvasResizerService.MIN_CANVAS_SIZE);
        TestBed.configureTestingModule({
            providers: [CanvasResizerService],
        });
        clearCanvasSpy = spyOn<any>(canvasResizerService, 'clearCanvas').and.callThrough();
        changeCanvasYSpy = spyOn<any>(canvasResizerService, 'changeCanvasY').and.callThrough();
        changeCanvasXSpy = spyOn<any>(canvasResizerService, 'changeCanvasX').and.callThrough();
    });

    it('should creer', inject([CanvasResizerService], (service: CanvasResizerService) => {
        expect(service).toBeTruthy();
    }));
});
