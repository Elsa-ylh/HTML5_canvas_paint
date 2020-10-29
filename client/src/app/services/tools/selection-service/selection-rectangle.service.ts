import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleService extends SelectionService {
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.mouseDownCoord.x !== this.mousePosition.x && this.mouseDownCoord.y !== this.mousePosition.y && !this.inSelection) {
                if (!this.shiftPressed) {
                    this.height = this.mousePosition.y - this.mouseDownCoord.y;
                    this.width = this.mousePosition.x - this.mouseDownCoord.x;
                }
                // this.drawSelectionRect(this.drawingService.previewCtx, this.mouseDownCoord, this.shiftPressed);

                this.selectRectInitialPos = this.mouseDownCoord;
                // console.log(" initial pos = " + this.selectRectInitialPos.x + this.selectRectInitialPos.y);
                this.copyImageInitialPos = this.copySelection();
                this.drawSelection(this.drawingService.previewCtx, this.mouseDownCoord, this.copyImageInitialPos);
                // this.drawingService.previewCtx.putImageData(this.imageData, this.copyImageInitialPos.x, this.copyImageInitialPos.y);
            } else if (this.inSelection) {
                this.pasteSelection(
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                    this.image,
                    this.imageData,
                );
                this.isAllSelect = false;
            }
        }

        this.mouseDown = false;
        this.inSelection = false;
        // this.mouseEnter = false;
    }

    drawSelection(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, imagePosition: Vec2): void {
        this.drawSelectionRect(ctx, mouseCoord);
        ctx.putImageData(this.imageData, imagePosition.x, imagePosition.y);
    }

    pasteSelection(position: Vec2, image: HTMLImageElement, imageData: ImageData): void {
        this.drawingService.baseCtx.putImageData(imageData, position.x, position.y);
    }

    drawPreview(): void {
        this.drawPreviewRect(this.drawingService.previewCtx, this.shiftPressed);
    }

    clearSelection(position: Vec2, width: number, height: number): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(position.x, position.y, width, height);
    }
}
