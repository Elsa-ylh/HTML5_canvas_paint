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

    currentStamp: HTMLImageElement; // the image stamp
    currentStampName: string = STAMP.stamp1; // the path to the image
    currentStamp2: HTMLImageElement;
    currentStamp2Name: string;

    canvasScale: number = 10; // by how much to increase or decrease image size
    imageScale: number = 1;
    newWidth: number; // width after resize
    newHeight: number; // height after resize

    private offSetX: number;
    private yOffset: number;
    private mouseCenterX: number; // x position of the mouse
    private mouseCenterY: number; // y position of the mouse

    stampMaxSize: number = 160;
    stampMinSize: number = 40;

    angle: number = 180;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseMove(event: MouseEvent): void {
        this.canvasWidth = this.drawingService.cursorCtx.canvas.offsetWidth / 2;
        this.canvasHeight = this.drawingService.cursorCtx.canvas.offsetHeight / 2;
        this.drawingService.cursorCtx.canvas.style.left = event.offsetX - this.canvasWidth + 'px';
        this.drawingService.cursorCtx.canvas.style.top = event.offsetY - this.canvasHeight + 'px';
    }

    // https://stackoverflow.com/questions/39619967/js-center-image-inside-canvas-element/39620144
    drawCursorImage(): void {
        const wrh = this.currentStamp.width / this.currentStamp.height;
        this.newWidth = this.drawingService.cursorCtx.canvas.width;
        this.newHeight = this.newWidth / wrh;
        if (this.newHeight > this.drawingService.cursorCtx.canvas.height) {
            this.newHeight = this.drawingService.cursorCtx.canvas.height;
            this.newWidth = this.newHeight * wrh;
        }
        this.offSetX =
            this.newWidth < this.drawingService.cursorCtx.canvas.width ? (this.drawingService.cursorCtx.canvas.width - this.newWidth) / 2 : 0;
        this.yOffset =
            this.newHeight < this.drawingService.cursorCtx.canvas.height ? (this.drawingService.cursorCtx.canvas.height - this.newHeight) / 2 : 0;

        this.drawingService.cursorCtx.save();
        this.drawingService.cursorCtx.translate(this.drawingService.cursorCtx.canvas.width / 2, this.drawingService.cursorCtx.canvas.height / 2);
        this.drawingService.cursorCtx.rotate(this.convertDegToRad(this.angle));
        this.drawingService.cursorCtx.translate(-this.drawingService.cursorCtx.canvas.width / 2, -this.drawingService.cursorCtx.canvas.height / 2);
        this.drawingService.cursorCtx.drawImage(this.currentStamp, this.offSetX, this.yOffset, this.newWidth, this.newHeight);
        this.drawingService.cursorCtx.restore();
        this.saveCanvas();
    }

    saveCanvas(): void {
        this.currentStamp2Name = this.drawingService.cursorCtx.canvas.toDataURL();
        console.log(this.currentStamp2Name);
    }

    increaseSize(): void {
        if (this.drawingService.cursorCtx.canvas.width < this.stampMaxSize) {
            this.drawingService.cursorCtx.canvas.width = this.drawingService.cursorCtx.canvas.width + this.canvasScale;
            this.drawingService.cursorCtx.canvas.height = this.drawingService.cursorCtx.canvas.height + this.canvasScale;
            this.drawingService.cursorCtx.scale(this.imageScale, this.imageScale);
        }
    }

    decreaseSize(): void {
        if (this.drawingService.cursorCtx.canvas.width > this.stampMinSize) {
            this.drawingService.cursorCtx.canvas.width = this.drawingService.cursorCtx.canvas.width - this.canvasScale;
            this.drawingService.cursorCtx.canvas.height = this.drawingService.cursorCtx.canvas.height - this.canvasScale;
            this.drawingService.cursorCtx.scale(this.imageScale, this.imageScale);
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.currentStamp2 = new Image();
        this.currentStamp2.src = this.currentStamp2Name;
        this.mouseCenterX = event.offsetX - this.canvasWidth;
        this.mouseCenterY = event.offsetY - this.canvasHeight;

        this.currentStamp2.onload = () => {
            this.drawingService.baseCtx.drawImage(this.currentStamp2, this.mouseCenterX, this.mouseCenterY, this.newWidth, this.newHeight);
        };
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
        this.currentStamp = new Image();
        this.currentStamp.src = this.currentStampName;
        this.currentStamp.onload = () => {
            this.drawCursorImage();
        };
    }

    convertDegToRad(angle: number): number {
        // tslint:disable:no-magic-numbers
        const convertedAngle = (angle * Math.PI) / 180;
        return convertedAngle;
    }
}
