/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

describe('ColorService', () => {
    let service: ColorService;
    let DrawingService: DrawingService;
    // let mouseEventDrawDot: MouseEvent;

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

        /*   mouseEventDrawDot = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent; */
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

    it('selectedColor() and getselectedColor() should return the attribut: selectedColor ', () => {
        service.setselectedColor('#FFFFFF');
        service.getselectedColor();
        expect(service.getselectedColor()).toEqual('#FFFFFF');
    });

    it('setpreviewColor() and getpreviewColor() should return the attribut: previewColor', () => {
        service.setpreviewColor('#FFFFFF');
        service.getpreviewColor();
        expect(service.getpreviewColor()).toEqual('#FFFFFF');
    });

    it('setprimaryColor() and getprimaryColor() should return the attribut: primaryColor', () => {
        service.setprimaryColor('#0000000');
        service.getprimaryColor();
        expect(service.getprimaryColor()).toEqual('#0000000');
    });

    it('setsecondaryColor() and getsecondaryColor() should return the attribut: secondaryColor ', () => {
        service.setsecondaryColor('#FFFFFF');
        service.getsecondaryColor();
        expect(service.getsecondaryColor()).toEqual('#FFFFFF');
    });

    it('setprimaryColorTransparency() and getprimaryColorTransparency() should return the attribut: primaryColorTransparency ', () => {
        service.setprimaryColorTransparency(1);
        service.getprimaryColorTransparency();
        expect(service.getprimaryColorTransparency()).toEqual(1);
    });

    it('setsecondaryColorTransparency() and getsecondaryColorTransparency() should return the attribut: secondaryColorTransparency ', () => {
        service.setsecondaryColorTransparency(2);
        service.getsecondaryColorTransparency();
        expect(service.getsecondaryColorTransparency()).toEqual(2);
    });

    /*
    it('drawMovingDot should call clearrect() ', () => {


    }); */
});
