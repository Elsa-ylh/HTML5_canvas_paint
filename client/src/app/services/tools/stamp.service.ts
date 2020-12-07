import { Injectable } from '@angular/core';
import { STAMP } from '@app/classes/stamp';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

// tslint:disable:max-file-line-count
// tslint:disable:max-line-length

export const FIFTEEN = 15;
export const ONE = 1;

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

    angle: number = 0; // angle of the image

    isWheelUp: boolean = true; // add or substract
    isAltPressed: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseMove(event: MouseEvent): void {
        this.canvasWidth = this.drawingService.cursorCtx.canvas.offsetWidth / 2;
        this.canvasHeight = this.drawingService.cursorCtx.canvas.offsetHeight / 2;
        this.drawingService.cursorCtx.canvas.style.left = event.offsetX - this.canvasWidth + 'px'; // centers the cursorCanvas's position x with the mouse
        this.drawingService.cursorCtx.canvas.style.top = event.offsetY - this.canvasHeight + 'px'; // centers the cursorCanvas's position y with the mouse
        this.drawCursorImage(); // draws the stamp
    }

    // https://stackoverflow.com/questions/39619967/js-center-image-inside-canvas-element/39620144
    drawCursorImage(): void {
        this.drawingService.cursorCtx.clearRect(0, 0, this.drawingService.cursorCtx.canvas.width, this.drawingService.cursorCtx.canvas.height);
        const wrh = this.currentStamp.width / this.currentStamp.height;
        this.newWidth = this.drawingService.cursorCtx.canvas.width;
        this.newHeight = this.newWidth / wrh;

        this.offSetX =
            this.newWidth < this.drawingService.cursorCtx.canvas.width ? (this.drawingService.cursorCtx.canvas.width - this.newWidth) / 2 : 0;
        this.yOffset =
            this.newHeight < this.drawingService.cursorCtx.canvas.height ? (this.drawingService.cursorCtx.canvas.height - this.newHeight) / 2 : 0;

        this.drawingService.cursorCtx.save(); // this section applies the rotation
        this.drawingService.cursorCtx.translate(this.drawingService.cursorCtx.canvas.width / 2, this.drawingService.cursorCtx.canvas.height / 2);
        this.drawingService.cursorCtx.rotate(this.convertDegToRad(this.angle));
        this.drawingService.cursorCtx.translate(-this.drawingService.cursorCtx.canvas.width / 2, -this.drawingService.cursorCtx.canvas.height / 2);
        this.drawingService.cursorCtx.drawImage(this.currentStamp, this.offSetX, this.yOffset, this.newWidth, this.newHeight);
        this.drawingService.cursorCtx.restore();
    }

    saveCanvas(): void {
        // saves the current cursor image so that it can be used on the main canvas
        this.currentStamp2Name = this.drawingService.cursorCtx.canvas.toDataURL();
    }

    increaseSize(): void {
        // increases the size of the stamp by 10
        if (this.drawingService.cursorCtx.canvas.width < this.stampMaxSize) {
            this.drawingService.cursorCtx.canvas.width = this.drawingService.cursorCtx.canvas.width + this.canvasScale;
            this.drawingService.cursorCtx.canvas.height = this.drawingService.cursorCtx.canvas.height + this.canvasScale;
            this.drawingService.cursorCtx.scale(this.imageScale, this.imageScale);
        }
    }

    decreaseSize(): void {
        // decreases the size of the stamp by 10
        if (this.drawingService.cursorCtx.canvas.width > this.stampMinSize) {
            this.drawingService.cursorCtx.canvas.width = this.drawingService.cursorCtx.canvas.width - this.canvasScale;
            this.drawingService.cursorCtx.canvas.height = this.drawingService.cursorCtx.canvas.height - this.canvasScale;
            this.drawingService.cursorCtx.scale(this.imageScale, this.imageScale);
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.saveCanvas(); // on mouse down, calls function to save the current cursor image
        this.currentStamp2 = new Image();
        this.currentStamp2.src = this.currentStamp2Name;
        this.mouseCenterX = event.offsetX - this.canvasWidth; // updates the current mouse position in x
        this.mouseCenterY = event.offsetY - this.canvasHeight; // updates the current mouse position in y

        this.currentStamp2.onload = () => {
            this.drawingService.baseCtx.drawImage(this.currentStamp2, this.mouseCenterX, this.mouseCenterY);
        };
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
        this.currentStamp = new Image();
        this.currentStamp.src = this.currentStampName;
    }

    onMouseOut(event: MouseEvent): void {
        this.drawingService.cursorCtx.clearRect(0, 0, this.drawingService.cursorCtx.canvas.width, this.drawingService.cursorCtx.canvas.height);
        this.drawingService.cursorCtx.canvas.style.display = 'none';
    }

    convertDegToRad(angle: number): number {
        // tslint:disable:no-magic-numbers
        const convertedAngle = (angle * Math.PI) / 180;
        return convertedAngle;
    }

    changeAngleWithScroll(): void {
        // change angle
        if (this.isWheelUp) {
            if (!this.isAltPressed) {
                this.angle += FIFTEEN;
            } else {
                this.angle += ONE;
            }
        } else {
            if (!this.isAltPressed) {
                this.angle -= FIFTEEN;
            } else {
                this.angle -= ONE;
            }
        }
    }

    addOrRetract(event: WheelEvent): void {
        if (event.deltaY < 0) {
            this.isWheelUp = true;
        } else {
            this.isWheelUp = false;
        }
    }
}
