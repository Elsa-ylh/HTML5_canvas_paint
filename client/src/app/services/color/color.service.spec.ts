/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { EventOfTest } from '@app/classes/event-of-test';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

describe('ColorService', () => {
    let service: ColorService;
    let DrawingService: DrawingService;
    let mouseEventDrawDot: EventOfTest;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // tslint:disable:no-any
    // let drawMovingDotSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        service = TestBed.inject(ColorService);
        //  drawMovingDotSpy= spyOn<any>(service, 'drawMovingDot').and.callThrough();

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEventDrawDot = new EventOfTest();
    });

    it('should be created', inject([ColorService], (serviceCol: ColorService) => {
        expect(serviceCol).toBeTruthy();
    }));

    /*
    it('getLastColor() and setLastColor() should get et set the color from lastColors ', () => {
        service.addLastColor('#FFFFFF');
        service.getlastColors();
        expect(service.getlastColors()).toEqual();
    });
    */

    it('drawMovingDot should call drawMovingDot should change line cap,stroke style and fillstyle', () => {
        service.drawMovingStopper(baseCtxStub, { x: 50, y: 50 }, mouseEventDrawDot.mouseEvent1);
        expect(baseCtxStub.lineCap).toEqual('round');
        expect(baseCtxStub.strokeStyle).toEqual('#000000');
        expect(baseCtxStub.fillStyle).toEqual('#ffffff');
    });

    it('getcolor() should read data from the canvas '),
        () => {
            baseCtxStub.strokeStyle = 'black';
            service.getColor({ x: 0, y: 0 }, baseCtxStub);
            const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
            expect(imageData.data[0]).toEqual(0); // R
            expect(imageData.data[1]).toEqual(0); // G
            expect(imageData.data[2]).toEqual(0); // B
            expect(imageData.data[3]).toEqual(1); // A
        };
});
