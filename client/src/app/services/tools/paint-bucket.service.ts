import { Injectable } from '@angular/core';
import { Fill } from '@app/classes/fill';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

// https://github.com/williammalone/HTML5-Paint-Bucket-Tool/blob/master/html5-canvas-paint-bucket.js => paint bucket in js

// The following pseudo code has been taken from this website : https://hackernoon.com/
// floodFill(image[row][col], x, y, prevColor, newColor)
// 1. If  x or y is outside the image, then return.
// 2. If image[x][y] is not same as previous color value, then return.
// 3. Call the function for north, south, east, west, north-west, north-east, south-west, south-east.
//         FloodFill(image, x+1, y, prevColor, newColor);
//         FloodFill(image, x, y+1, prevColor, newColor);
//         FloodFill(image, x-1, y, prevColor, newColor);
//         FloodFill(image, x, y-1, prevColor, newColor);
//         FloodFill(image, x+1, y+1, prevColor, newColor);
//         FloodFill(image, x+1, y-1, prevColor, newColor);
//         FloodFill(image, x-1, y+1, prevColor, newColor);
//         FloodFill(image, x-1, y-1, prevColor, newColor);

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    fillColor: string;
    mousePosition: Vec2;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    paintBucketTool: number = 8;

    constructor(drawingService: DrawingService, private colorService: ColorService, private canvasResizerService: CanvasResizerService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.clearEffectTool();
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.fillColor = this.colorService.primaryColor;
        if (this.mouseEnter) {
            this.onMouseUp(event);
        }
        if (this.mouseDown && this.subToolSelect === this.paintBucketTool) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            // tslint:disable-next-line:no-unused-expression
            new Fill(
                this.drawingService.baseCtx,
                this.mouseDownCoord,
                this.fillColor,
                this.drawingService,
                this.colorService,
                this.canvasResizerService,
            );
        }
        this.mousePosition = this.mouseDownCoord;
    }

    // onMouseDown(event: MouseEvent): void {
    //   this.fillStack.push(new Point2D(event.offsetX, event.offsetY));
    //   this.targetColor = this.colorService.getColor((new Point2D (event.offsetX, event.offsetY)) as Vec2, this.drawingService.baseCtx);

    //   this.control.addShape(this.shape);
    //   this.shape.style.strokeWidth = '1';
    //   this.shape.style.primaryColor = this.colorService.primaryColor;
    //   this.shape.style.secondaryColor = this.colorService.secondaryColor;
    //   while (this.fillStack.length !== 0) {
    //     console.log(this.fillStack.length);
    //     let point = this.fillStack.pop();
    //     while (point && this.visitedIncludes(point)) { point = this.fillStack.pop(); }
    //     console.log(this.stack.length);
    //     if (point) { this.floodFill(point);}
    //     this.pathify();
    //   }
    // }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.mouseEnter = false;
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseOut = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseOut) {
            this.mouseEnter = true;
        }
        this.mouseOut = false;
    }
}
