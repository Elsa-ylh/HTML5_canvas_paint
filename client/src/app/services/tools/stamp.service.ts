import { Injectable } from '@angular/core';
import { STAMP } from '@app/classes/stamp';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    private canvasWidth: number;
    private canvasHeight: number;
    currentStamp: HTMLImageElement;

    canvasScale: number = 80;
    imageScale: number = 1;

    newWidth: number;
    newHeight: number;
    xOffset: number;
    yOffset: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseMove(event: MouseEvent): void {
        this.canvasWidth = this.drawingService.cursorCtx.canvas.offsetWidth / 2;
        this.canvasHeight = this.drawingService.cursorCtx.canvas.offsetHeight / 2;
        this.drawingService.cursorCtx.canvas.style.left = event.offsetX - this.canvasWidth + 'px';
        this.drawingService.cursorCtx.canvas.style.top = event.offsetY - this.canvasHeight + 'px';
    }

    drawImage(): void {
        this.currentStamp = new Image();
        this.currentStamp.src = STAMP.stamp1;
        const wrh = this.currentStamp.width / this.currentStamp.height;
        this.newWidth = this.drawingService.cursorCtx.canvas.width;
        this.newHeight = this.newWidth / wrh;
        if (this.newHeight > this.drawingService.cursorCtx.canvas.height) {
            this.newHeight = this.drawingService.cursorCtx.canvas.height;
            this.newWidth = this.newHeight * wrh;
        }
        this.xOffset =
            this.newWidth < this.drawingService.cursorCtx.canvas.width ? (this.drawingService.cursorCtx.canvas.width - this.newWidth) / 2 : 0;
        this.yOffset =
            this.newHeight < this.drawingService.cursorCtx.canvas.height ? (this.drawingService.cursorCtx.canvas.height - this.newHeight) / 2 : 0;

        this.currentStamp.onload = () => {
            this.drawingService.cursorCtx.drawImage(this.currentStamp, this.xOffset, this.yOffset, this.newWidth, this.newHeight);
        };
    }

    increaseSize(): void {
        this.drawingService.cursorCtx.canvas.width = this.drawingService.cursorCtx.canvas.width + this.canvasScale;
        this.drawingService.cursorCtx.canvas.height = this.drawingService.cursorCtx.canvas.height + this.canvasScale;
        this.drawingService.cursorCtx.scale(this.imageScale, this.imageScale);
    }

    decreaseSize(): void {
        this.drawingService.cursorCtx.canvas.width = this.drawingService.cursorCtx.canvas.width - this.canvasScale;
        this.drawingService.cursorCtx.canvas.height = this.drawingService.cursorCtx.canvas.height - this.canvasScale;
        this.drawingService.cursorCtx.scale(this.imageScale, this.imageScale);
    }

    onMouseDown(event: MouseEvent): void {
        this.currentStamp = new Image();
        this.currentStamp.src = STAMP.stamp1;

        this.currentStamp.onload = () => {
            this.drawingService.baseCtx.drawImage(this.currentStamp, event.offsetX, event.offsetY, this.newWidth, this.newHeight);
        };
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
        this.drawImage();
    }
}
