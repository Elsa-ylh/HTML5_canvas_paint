import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
describe('DrawingService', () => {
    let service: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('isCanvasBlank should return true if canvas is empty', () => {
        service.clearCanvas(service.baseCtx);
        expect(service.isCanvasBlank()).toEqual(true);
    });

    it('isCanvasBlank should return false if canvas is not empty', () => {
        // tslint:disable: no-magic-numbers
        service.baseCtx.fillRect(20, 20, 100, 100);
        expect(service.isCanvasBlank()).toEqual(false);
    });

    it('isPreviewCanvasBlank should return false if canvas is not empty', () => {
        // tslint:disable: no-magic-numbers
        service.previewCtx.fillRect(20, 20, 100, 100);
        expect(service.isPreviewCanvasBlank()).toEqual(false);
    });
    it('should something', () => {
        service.previewCtx.fillRect(20, 20, 100, 100);
        const spy = spyOn(service.baseCtx, 'drawImage').and.stub();
        service.convertBase64ToBaseCanvas('img');
        let event = new Event('onload');
        service['image'].dispatchEvent(event);

        expect(spy).toHaveBeenCalled();
    });
});
