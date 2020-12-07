import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

export class SelectionImage {
    constructor(drawingService: DrawingService) {
        this.copyImageInitialPos = this.imagePosition = { x: 0, y: 0 };
        this.width = 0;
        this.height = 0;
        this.imageSize = { x: 0, y: 0 };
        this.endingPos = { x: 0, y: 0 };
        this.ellipseRad = { x: 0, y: 0 };
        this.drawingService = drawingService;
        this.rotationAngle = 0;
    }
    drawingService: DrawingService;
    copyImageInitialPos: Vec2;
    imagePosition: Vec2;
    endingPos: Vec2;
    imageData: ImageData;
    image: HTMLImageElement;
    imageSize: Vec2;
    height: number;
    width: number;
    ellipseRad: Vec2;
    rotationAngle: number;

    getImage(size: Vec2): void {
        this.imageSize = size;
        this.imageData = this.drawingService.baseCtx.getImageData(this.imagePosition.x, this.imagePosition.y, this.width, this.height);
        this.image = new Image();
        this.image.src = this.getImageURL(this.imageData, this.imageSize.x, this.imageSize.y);
    }

    getImageURL(imgData: ImageData, width: number, height: number): string {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const ctx = (canvas.getContext('2d') as CanvasRenderingContext2D) as CanvasRenderingContext2D;
        canvas.width = Math.abs(width);
        canvas.height = Math.abs(height);
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }

    isInsideSelection(mouse: Vec2): boolean {
        if (
            this.imagePosition.x !== 0 &&
            this.imagePosition.x !== 0 &&
            this.endingPos.x !== 0 &&
            this.endingPos.y !== 0 &&
            !this.drawingService.isPreviewCanvasBlank()
        ) {
            const minX = Math.min(this.endingPos.x, this.imagePosition.x);
            const maxX = Math.max(this.endingPos.x, this.imagePosition.x);
            const minY = Math.min(this.endingPos.y, this.imagePosition.y);
            const maxY = Math.max(this.endingPos.y, this.imagePosition.y);

            if (mouse.x > minX && mouse.x < maxX && mouse.y > minY && mouse.y < maxY) {
                return true;
            }
        }
        return false;
    }

    resetSelection(): void {
        this.copyImageInitialPos = this.imagePosition = { x: 0, y: 0 };
        this.width = 0;
        this.height = 0;
        this.imageSize = { x: 0, y: 0 };
        this.endingPos = { x: 0, y: 0 };
        this.ellipseRad = { x: 0, y: 0 };
    }
        resetAngle(): void {
      this.rotationAngle = 0;
    }
}
