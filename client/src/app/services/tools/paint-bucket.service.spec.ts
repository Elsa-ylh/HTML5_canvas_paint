/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
// import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';
// import { CanvasResizerService } from '../canvas/canvas-resizer.service';

describe('Service: PaintBucket', () => {
    /*tslint:disable:no-any*/
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let paintBucketService: PaintBucketService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    // tslint:disable-next-line:prefer-const
    // let canvasReziserServiceSpy: jasmine.SpyObj<CanvasResizerService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let mouseEventTest: MouseEvent;
    let hexToRGBASpy: jasmine.Spy<any>;
    let matchFillColorSpy: jasmine.Spy<any>;
    let floodFillSpy: jasmine.Spy<any>;
    let paintAllSimilarSpy: jasmine.Spy<any>;
    let toleranceToRGBASpy: jasmine.Spy<any>;

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
        mouseEventTest = { x: 25, y: 25, button: MouseButton.Left } as MouseEvent;
        // tslint:disable:no-string-literal
        paintBucketService['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        paintBucketService['drawingService'].previewCtx = previewCtxStub;
        // spy for private methods
        hexToRGBASpy = spyOn<any>(paintBucketService, 'hexToRGBA').and.callThrough();
        matchFillColorSpy = spyOn<any>(paintBucketService, 'matchFillColor').and.callThrough();
        floodFillSpy = spyOn<any>(paintBucketService, 'floodFill').and.callThrough();
        paintAllSimilarSpy = spyOn<any>(paintBucketService, 'paintAllSimilar').and.callThrough();
        toleranceToRGBASpy = spyOn<any>(paintBucketService, 'toleranceToRGBA').and.callThrough();
    });

    it('should be created', () => {
        expect(paintBucketService).toBeTruthy();
    });

    it('should call floodFill', () => {
        paintBucketService.floodFill(mouseEventTest.x, mouseEventTest.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it('should call matchFillColor', () => {
        paintBucketService.matchFillColor({ red: 0, green: 0, blue: 0, alpha: 1 }, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(matchFillColorSpy).toHaveBeenCalled();
    });

    // it('matchFillColor should be false', () => {
    //   paintBucketService.matchFillColor({ red: 1, green: 1, blue: 1, alpha: 1}, { red: 0, green: 0, blue: 0, alpha: 1})
    //   expect(matchFillColorSpy).toBeFalsy();
    // });

    it('should call hexToRGBA', () => {
        paintBucketService.hexToRGBA('#000000');
        expect(hexToRGBASpy).toHaveBeenCalled();
    });

    it('should call paintAllSimilar', () => {
        paintBucketService.paintAllSimilar(mouseEventTest.x, mouseEventTest.y, { red: 0, green: 0, blue: 0, alpha: 1 });
        expect(paintAllSimilarSpy).toHaveBeenCalled();
    });

    it('should call toleranceToRGBASpy', () => {
        paintBucketService.toleranceToRGBA();
        expect(toleranceToRGBASpy).toHaveBeenCalled();
    });
});
