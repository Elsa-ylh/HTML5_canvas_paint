/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection-service';

describe('Service: SelectionService', () => {
  let service: SelectionService;
  let mouseEvent: MouseEvent;
  //let imageDataMock: ImageData;

  let drawServiceSpy: jasmine.SpyObj<DrawingService>;

  let getPositionFromMouseSpy: jasmine.Spy<any>;
  let isInsideSelectionSpy: jasmine.Spy<any>;
  let drawPreviewSpy: jasmine.Spy<any>;
  let drawSelectionSpy: jasmine.Spy<any>;
  let onMouseUpSpy: jasmine.Spy<any>;
  let fillRectSpy: jasmine.Spy<any>;
  let getImageDataSpy: jasmine.Spy<any>;
  let moveSelectiontimerRightSpy: jasmine.Spy<any>;
  let moveSelectiontimerLeftSpy: jasmine.Spy<any>;
  // let moveSelectiontimerUpSpy: jasmine.Spy<any>;
  // let moveSelectiontimerDownSpy: jasmine.Spy<any>;
  // let clearSelectionSpy: jasmine.Spy<any>;
  // let putImageDataSpy: jasmine.Spy<any>;



  // let drawServiceSpy: jasmine.SpyObj<DrawingService>;

  let baseCtxStub: CanvasRenderingContext2D;
  let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
      baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
      previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
      drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'isPreviewCanvasBlank']);
        TestBed.configureTestingModule({
            providers: [SelectionService,
              { provide: DrawingService, useValue: drawServiceSpy },],
        });

        service = TestBed.inject(SelectionService);
        getPositionFromMouseSpy = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        isInsideSelectionSpy = spyOn<any>(service, 'isInsideSelection').and.callThrough();
        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.callThrough();



        // drawSelectionSpy = spyOn<any>(service, 'putImageData').and.callThrough();
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas as HTMLCanvasElement;

    });



    it('should be created', inject([SelectionService], (service: SelectionService) => {
        expect(service).toBeTruthy();
    }));

    it(' mouseDown should save mouse coord', () => {
      mouseEvent = {
        button: 0,
      } as MouseEvent;

      service.mouseDown = true;
      service.onMouseDown(mouseEvent);
      expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

  it(' mouseDown should check if mouse coord are in selection if a selection is drawn', () => {
    mouseEvent = {
      button: 0,
    } as MouseEvent;

    service.mouseDown = true;
    service.mousePosition = {x:1, y:1};
    service.mouseDownCoord = {x:1, y:1};
    service.onMouseDown(mouseEvent);
    expect(isInsideSelectionSpy).toHaveBeenCalled();
  });


  it(' onMouseMove should draw a preview if user is drawing a selection', () => {
    mouseEvent = {
      button: 0,
      offsetX: 25,
      offsetY: 25,
    } as MouseEvent;

    service.mouseDown = true;
    service.inSelection = false;
    service.onMouseMove(mouseEvent);
    expect(drawPreviewSpy).toHaveBeenCalled();
  });


  it(' onMouseMove should draw the selection if user is moving a selection', () => {
    mouseEvent = {
      button: 0,
      offsetX: 25,
      offsetY: 25,
    } as MouseEvent;
    drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    service.mouseDown = true;
    service.inSelection = true;
    service.mouseDownCoord = {x:1, y:1};
    service.selectRectInitialPos = {x:1, y:1};
    service.mouseMouvement = {x:20, y:20};
    service.copyImageInitialPos = {x:1, y:1};
    service.onMouseMove(mouseEvent);
    expect(drawSelectionSpy).toHaveBeenCalled();
  });

  it(' onEscapeKey should reset the canvas if a selection has been drawn', () => {
    let keyEvent = {} as KeyboardEvent;
    service.imageData = baseCtxStub.createImageData(10,10);
    service.inSelection = true;
    service.copyImageInitialPos = {x:1, y:1};
    service.onKeyEscape(keyEvent);
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
  });


  // it(' onEscapeKey should reset all the arrow key timers', () => {
  //   let keyEvent = {} as KeyboardEvent;
  //   service.imageData = baseCtxStub.createImageData(10,10);
  //   service.inSelection = true;
  //   service.copyImageInitialPos = {x:1, y:1};
  //   service.timerDown = true;
  //   service.timerLeft = true;
  //   service.timerRight = true;
  //   service.timerStarted = true;
  //   service.timerUp = true;
  //   service.onKeyEscape(keyEvent);
  //   expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
  // });

  it(' onMouseOut should reset the canvas if a selection is being moved', () => {
    let mouseEvent = {} as MouseEvent;
    service.imageData = baseCtxStub.createImageData(10,10);
    service.inSelection = true;
    service.copyImageInitialPos = {x:1, y:1};
    service.mouseDown = true;
    service.onMouseOut(mouseEvent);
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
  });


  it(' onMouseOut should call on mouse up if a selection is being drawn', () => {
    let mouseEvent = {} as MouseEvent;
    onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.callThrough();
    service.imageData = baseCtxStub.createImageData(10,10);
    service.inSelection = false;
    service.copyImageInitialPos = {x:1, y:1};
    service.mouseDown = false;
    service.onMouseOut(mouseEvent);
    expect(onMouseUpSpy).toHaveBeenCalled();
  });

  it(' onShiftKeyDown should reset the preview canvas an draw a preview', () => {
    let keyEvent = {} as KeyboardEvent;
    service.mouseDown = true;
    service.inSelection = false;
    service.onShiftKeyDown(keyEvent);
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    expect(drawPreviewSpy).toHaveBeenCalled();
  });

  it(' onShiftKeyUp should reset the preview canvas an draw a preview', () => {
    let keyEvent = {} as KeyboardEvent;
    service.mouseDown = true;
    service.inSelection = false;
    service.onShiftKeyUp(keyEvent);
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    expect(drawPreviewSpy).toHaveBeenCalled();
  });

  it(' clearEffectTool should reset drawing effects on canvas', () => {
    service.clearEffectTool();
    expect(service['drawingService'].previewCtx.lineCap).toEqual('square');
  });


  it(' selectAll should draw a selection of the entire canvas', () => {
    drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    service.selectAll();
    expect(drawSelectionSpy).toHaveBeenCalled();
  });

  it(' drawPreviewRect should draw a preview square if shift is pressed in the preview canvas', () => {
    service.mouseDownCoord = {x:1, y:1};
    service.mousePosition = {x:30, y:20};
    service.drawPreviewRect(service['drawingService'].previewCtx, true);

    expect(service.width).toEqual(19);
    expect(service.height). toEqual(19);
  });

  it(' drawPreviewRect should draw a preview rectangle in the preview canvas', () => {
    service.mouseDownCoord = {x:1, y:1};
    service.mousePosition = {x:30, y:20};
    service.drawPreviewRect(service['drawingService'].previewCtx, false);

    expect(service.width).toEqual(29);
    expect(service.height). toEqual(19);
  });

  it(' drawSelectionRect should draw a selection rectangle in the preview canvas', () => {
    service.width = 20;
    service.height = 20;
    service.modifSelectSquare = 2;
    fillRectSpy= spyOn<any>(service['drawingService'].previewCtx, 'fillRect').and.callThrough();
    service.drawSelectionRect(service['drawingService'].previewCtx, {x:1, y:1});
    expect(fillRectSpy).toHaveBeenCalled();
  });

  it(' copySelection should get the imageData of a selection and return the image starting position', () => {
    service.width = 20;
    service.height = 20;
    service.mouseDownCoord = {x:1, y:1};
    service.mousePosition = {x:20, y:20};
    getImageDataSpy= spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
    expect(service.copySelection()).toEqual({x:1, y:1});
    expect(getImageDataSpy).toHaveBeenCalled();
  });

  it(' copySelection should get the imageData of a selectionand return the image starting position', () => {
    service.width = 20;
    service.height = 20;
    service.mouseDownCoord = {x:20, y:1};
    service.mousePosition = {x:1, y:20};
    getImageDataSpy= spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
    expect(service.copySelection()).toEqual({x:1, y:1});
    expect(getImageDataSpy).toHaveBeenCalled();
  });

  it(' copySelection should get the imageData of a selectionand return the image starting position', () => {
    service.width = 20;
    service.height = 20;
    service.mouseDownCoord = {x:1, y:20};
    service.mousePosition = {x:20, y:1};
    getImageDataSpy= spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
    expect(service.copySelection()).toEqual({x:1, y:1});
    expect(getImageDataSpy).toHaveBeenCalled();
  });

  it(' copySelection should get the imageData of a selectionand return the image starting position', () => {
    service.width = 20;
    service.height = 20;
    service.mouseDownCoord = {x:20, y:20};
    service.mousePosition = {x:1, y:1};
    getImageDataSpy= spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
    expect(service.copySelection()).toEqual({x:1, y:1});
    expect(getImageDataSpy).toHaveBeenCalled();
  });

  it(' isInsideSelection should return if the mouse position is inside a selection', () => {
    service.mouseDownCoord = {x:1, y:1};
    service.mousePosition = {x:20, y:20};
    expect(service.isInsideSelection({x:10, y:10})).toEqual(true);
  });

  it(' onLeftArrow should draw a selection with 3px mouvement', () => {
    drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    moveSelectiontimerLeftSpy = spyOn<any>(service, 'moveSelectiontimerLeft').and.callThrough();
    service.mouseMouvement = {x:10, y:10};
    service.selectRectInitialPos = {x:1, y:1};
    service.copyImageInitialPos = {x:1, y:1};
    drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    service.width = 20;
    service.height = 20;
    service.leftArrow = false;
    service.time = 550;
    service.timerStarted = true;
    service.onLeftArrow();


    expect(drawSelectionSpy).toHaveBeenCalled();
    expect(moveSelectiontimerLeftSpy).toHaveBeenCalled();
  });


  it(' onRightArrow should draw a selection with 3px mouvement', () => {
    drawSelectionSpy = spyOn<any>(service, 'drawSelection').and.callThrough();
    moveSelectiontimerRightSpy = spyOn<any>(service, 'moveSelectiontimerRight').and.callThrough();

    service.mouseMouvement = {x:10, y:10};
    service.selectRectInitialPos = {x:1, y:1};
    service.copyImageInitialPos = {x:1, y:1};
    drawServiceSpy.isPreviewCanvasBlank.and.returnValue(false);
    service.width = 20;
    service.height = 20;
    service.rightArrow = false;
    service.timerStarted = true;
    service.time = 550
    service.onRightArrow();
;

    expect(drawSelectionSpy).toHaveBeenCalled();
    expect(moveSelectiontimerRightSpy).toHaveBeenCalled();
  });



});
