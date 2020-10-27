import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionEllipseService extends SelectionService {
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    drawSelection(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, imagePosition: Vec2): void {
        ctx.save();
        ctx.beginPath();
        this.drawEllipse(ctx, mouseCoord, this.width / 2, this.height / 2);
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(this.image, imagePosition.x, imagePosition.y);
        ctx.restore();
    }

    pasteSelection(position: Vec2, image: HTMLImageElement, imageData: ImageData): void {
        this.drawingService.baseCtx.save();
        this.drawingService.baseCtx.globalAlpha = 0;
        this.drawingService.baseCtx.beginPath();
        this.drawEllipse(this.drawingService.baseCtx, position, this.width / 2, this.height / 2);
        this.drawingService.baseCtx.stroke();
        this.drawingService.baseCtx.clip();
        this.drawingService.baseCtx.globalAlpha = 1;
        this.drawingService.baseCtx.drawImage(image, position.x, position.y);
        this.drawingService.baseCtx.restore();
    }

    drawPreview(): void {
        this.drawPreviewEllipse(this.drawingService.previewCtx);
    }

    drawPreviewEllipse(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDownCoord !== this.mousePosition) {
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            this.drawPreviewRect(ctx, false);
            ctx.beginPath();
            this.drawEllipse(ctx, this.mouseDownCoord, this.width / 2, this.height / 2);
            ctx.stroke();
        }
    }

    drawEllipse(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, radiusX: number, radiusY: number): void {
        let centerX = 0;
        let centerY = 0;
        centerX = mouseCoord.x + radiusX;
        centerY = mouseCoord.y + radiusY;
        if (!this.inSelection) {
            if (this.shiftPressed) {
                this.ellipseRad.x = Math.min(Math.abs(radiusX), Math.abs(radiusY));
                this.ellipseRad.y = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            } else {
                this.ellipseRad.x = Math.abs(radiusX);
                this.ellipseRad.y = Math.abs(radiusY);
            }
        }

        ctx.ellipse(centerX, centerY, this.ellipseRad.x, this.ellipseRad.y, 0, 0, 2 * Math.PI);
    }
}
