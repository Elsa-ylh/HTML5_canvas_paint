/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
// import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';

describe('Service: PaintBucket', () => {
    /*tslint:disable:no-any*/
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let paintBucketService: PaintBucketService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    // tslint:disable-next-line:prefer-const
    // let canvasReziserServiceSpy: jasmine.SpyObj<CanvasResizerService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // let mouseEvent: MouseEvent;
    // let hexToRgbASpy: jasmine.Spy<any>;
    // let matchFillColorSpy: jasmine.Spy<any>;
    // let floodFillSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'clearEffectTool']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['getprimaryColor', 'getsecondaryColor']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        paintBucketService = TestBed.inject(PaintBucketService);
        // mouseEvent = { x: 25, y: 25, button: MouseButton.Left } as MouseEvent;
        // tslint:disable:no-string-literal
        paintBucketService['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        paintBucketService['drawingService'].previewCtx = previewCtxStub;
        // spy for private methods
        // hexToRgbASpy = spyOn<any>(paintBucketService, 'hexToRgbA').and.callThrough();
        // matchFillColorSpy = spyOn<any>(paintBucketService, 'matchFillColor').and.callThrough();
        // floodFillSpy = spyOn<any>(paintBucketService, 'checkFourPolesAndDraw').and.callThrough();
    });

    it('should be created', () => {
        expect(paintBucketService).toBeTruthy();
    });

    /*
    it(' mouseDown should set mouseDown property to true on left click', () => {
        paintBucketService.onMouseDown(mouseEvent);
        expect(paintBucketService.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        paintBucketService.onMouseDown(mouseEventRClick);
        expect(paintBucketService.mouseDown).toEqual(false);
    });

    it('mouseDown should call floodFill', () => {
        paintBucketService.onMouseDown(mouseEvent);
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it(' should change mouseOut value to true when the mouse is living the canvas while left click is pressed', () => {
        paintBucketService.mouseDown = true;
        paintBucketService.onMouseOut(mouseEvent);
        expect(paintBucketService.mouseOut).toEqual(true);
    });

    it(' should not change mouseOut value to true when the mouse is living the canvas while left click is not pressed', () => {
        paintBucketService.mouseDown = false;
        paintBucketService.onMouseOut(mouseEvent);
        expect(paintBucketService.mouseOut).toEqual(false);
    });

    it('originalColor and replacementColor are the same', () => {
        const originalColor: RGBA = { red: 0, green: 0, blue: 0, alpha: 1 };
        const replacementColor: RGBA = { red: 0, green: 0, blue: 0, alpha: 1 };
        const check = matchFillColorSpy(originalColor, replacementColor);
        expect(check).toBeTrue();
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it('should call matchFillColor', () => {
        const mouseEventTest = { offsetX: 15, offsetY: 15 } as MouseEvent;
        paintBucketService.onMouseMove(mouseEventTest);
        expect(paintBucketService.matchFillColor).toHaveBeenCalled();
    });

    it('matchFillColor to be true', () => {
        const currentColor: RGBA = { red: 0, green: 0, blue: 1, alpha: 1 };
        const targetColor: RGBA = { red: 0, green: 0, blue: 1, alpha: 1 };
        const check = matchFillColorSpy(currentColor, targetColor);
        expect(check).toBeTrue();
    });

    it('should call hexToRgbA', () => {
        const mouseEventTest = { offsetX: 15, offsetY: 15 } as MouseEvent;
        paintBucketService.onMouseMove(mouseEventTest);
        expect(paintBucketService.hexToRgbA).toHaveBeenCalled();
    });

    it('x < canvasSize.x - 1', () => {
        const originalColor: RGBA = { red: 0, green: 0, blue: 0, alpha: 1 };
        const pixelColor: RGBA = { red: 0, green: 0, blue: 0, alpha: 1 };
        const check = matchFillColorSpy(originalColor, pixelColor);
        expect(check).toBeTrue();
    });
    */
});
