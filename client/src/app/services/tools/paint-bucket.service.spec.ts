/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';
import { CanvasResizerService } from '../canvas/canvas-resizer.service';

describe('Service: PaintBucket', () => {
  let colorServiceSpy : jasmine.SpyObj<ColorService>;
  let paintBucketService : PaintBucketService;
  let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
  let canvasReziserServiceSpy : jasmine.SpyObj<CanvasResizerService>;
  let baseCtxStub: CanvasRenderingContext2D;
  let previewCtxStub: CanvasRenderingContext2D;
  let mouseEvent: MouseEvent;
  let getPosColorSpy: jasmine.Spy<any>;
  let drawPosColorSpy : jasmine.Spy<any>;
  let compareRGBASpy : jasmine.Spy<any>;
  let checkFourPolesAndDrawSpy : jasmine.Spy<any>;

    beforeEach(() => {
      baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
      previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
      drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'clearEffectTool']);
      colorServiceSpy = jasmine.createSpyObj('ColorService', ['getprimaryColor', 'getsecondaryColor']);
        TestBed.configureTestingModule({
            providers: [
              { provide : DrawingService, useValue : drawingServiceSpy },
              { provide : ColorService, useValue : colorServiceSpy}
            ],
        });
        paintBucketService = TestBed.inject(PaintBucketService);
        mouseEvent = { x: 25, y: 25, button: MouseButton.Left } as MouseEvent;
          // tslint:disable:no-string-literal
          paintBucketService['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
          paintBucketService['drawingService'].previewCtx = previewCtxStub;
          // spy for private methods
          getPosColorSpy = spyOn<any>(paintBucketService, 'getPosColor').and.callThrough();
          drawPosColorSpy = spyOn<any>(paintBucketService, 'drawPosColor').and.callThrough();
          compareRGBASpy = spyOn<any>(paintBucketService, 'compareRGBA').and.callThrough();
          checkFourPolesAndDrawSpy = spyOn<any>(paintBucketService, 'checkFourPolesAndDraw').and.callThrough();
    });

    it('should ...', inject([PaintBucketService], (service: PaintBucketService) => {
        expect(paintBucketService).toBeTruthy();
    }));

    it(' mouseDown should set mouseDownCoord to correct position', () => {
      const expectedResult: Vec2 = { x: 25, y: 25 };
      paintBucketService.onMouseDown(mouseEvent);
      expect(paintBucketService.mouseDownCoord).toEqual(expectedResult);

    });

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

  it('mouseDown should call getPosColor', () => {
    paintBucketService.onMouseDown(mouseEvent);
    expect(getPosColorSpy).toHaveBeenCalled();
  });

  it('mouseDown should call drawPosColor', () => {
    paintBucketService.onMouseDown(mouseEvent);
    expect(drawPosColorSpy).toHaveBeenCalled();
  });

  it('mouseDown should call compareRGBA', () => {
    paintBucketService.onMouseDown(mouseEvent);
    expect(compareRGBASpy).toHaveBeenCalled();
  });

  it('mouseDown should call checkFourPolesAndDraw', () => {
    paintBucketService.onMouseDown(mouseEvent);
    expect(checkFourPolesAndDrawSpy).toHaveBeenCalled();
  });

  it('event.offsetY > 0', () => {
    let offset : Vec2 = {x: 100 , y: 100}
    let vec2 = drawPosColorSpy([offset.x, offset.y]);
    expect(vec2).toEqual({x:100, y:100});
  });

  it('event.offsetX > 0', () => {
    let offset : Vec2 = {x: 100 , y: 100}
    let vec2 = drawPosColorSpy([offset.x, offset.y]);
    expect(vec2).toEqual({x:100, y:100});
  });

  it('event.offsetX < canvasSize', () => {
    let tmp = canvasReziserServiceSpy.canvasSize.x - 1;
    let offset : Vec2 = {x: tmp , y: 0}
    let vec2 = drawPosColorSpy([offset.x, offset.y]);
    expect(vec2).toEqual({x:tmp, y:0});
    expect(checkFourPolesAndDrawSpy).toHaveBeenCalled();
  });

  it('event.offsetY < canvasSize', () => {
    let tmp = canvasReziserServiceSpy.canvasSize.y - 1;
    let offset : Vec2 = {x: 0 , y: tmp}
    let vec2 = drawPosColorSpy([offset.x, offset.y]);
    expect(vec2).toEqual({x:0, y:tmp});
    expect(checkFourPolesAndDrawSpy).toHaveBeenCalled();
  });

  it('event.offsetY > canvasSize', () => {
    let tmp = canvasReziserServiceSpy.canvasSize.y + 1;
    let offset : Vec2 = {x: 0 , y: tmp}
    let vec2 = drawPosColorSpy([offset.x, offset.y]);
    expect(vec2).toEqual({x:0, y:tmp});
    expect(checkFourPolesAndDrawSpy).not.toHaveBeenCalled();
  });

  it('event.offsetX > canvasSize', () => {
    let tmp = canvasReziserServiceSpy.canvasSize.y + 1;
    let offset : Vec2 = {x: 0 , y: tmp}
    let vec2 = drawPosColorSpy([offset.x, offset.y]);
    expect(vec2).toEqual({x:0, y:tmp});
    expect(checkFourPolesAndDrawSpy).not.toHaveBeenCalled();
  });

  it('curremtColor and targetColor are the same', () => {
    let currentColor : RGBA = {red : 0, green:0, blue:0, alpha : 1};
    let targetColor : RGBA = {red : 0, green:0, blue:0, alpha : 1};
    let check = compareRGBASpy(currentColor,targetColor);
    expect(check).toBeTrue;
    expect(checkFourPolesAndDrawSpy).toHaveBeenCalled();
  });
  it('curremtColor and targetColor are different', () => {
    let currentColor : RGBA = {red : 1, green:0, blue:0, alpha : 1};
    let targetColor : RGBA = {red : 0, green:2, blue:0, alpha : 1};
    let check = compareRGBASpy(currentColor,targetColor);
    expect(check).toBeFalse;
    expect(checkFourPolesAndDrawSpy).not.toHaveBeenCalled();
  });



});
