import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

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
    lineWidth: number = 1;
    fillColor: string;
    mousePosition: Vec2;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
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
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
        // new Fill (this.drawingService.baseCtx, this.mouseDownCoord, this.fillColor)
        this.mousePosition = this.mouseDownCoord;
    }

    // async onMouseDown(e: MouseEvent): Promise<void> {
    //   await this.getCanvasData();
    //   this.stack.push(new Point2D(e.offsetX, e.offsetY));
    //   this.targetColor = this.getColor(new Point2D(e.offsetX, e.offsetY));
    //   this.visited = [];
    //   this.control.addShape(this.shape);
    //   this.shape.style.strokeWidth = '1';
    //   this.shape.style.primaryColor = this.colors.getPrimaryString();
    //   this.shape.style.secondaryColor = this.colors.getPrimaryString();
    //   while (this.stack.length !== 0) {
    //     console.log(this.stack.length);
    //     let point = this.stack.pop();
    //     while (point && this.visitedIncludes(point)) { point = this.stack.pop(); }
    //     console.log(this.stack.length);
    //     if (point) { this.floodFill(point);}
    //     this.pathify();
    //   }

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

    // floodFill(pos: Point2D, stack: Point2D[]): void {
    //   if (this.stroke.includes(pos)) { return; }
    //   this.setColor(pos);
    //   this.stroke.push(pos);
    //   const cardinalPoints: Point2D[] = [{x: pos.x, y: pos.y - 1}, {x: pos.x + 1, y: pos.y},
    //                                      {x: pos.x, y: pos.y + 1}, {x: pos.x - 1, y: pos.y}];
    //   cardinalPoints.forEach( (point) => {
    //     const color = this.getColor(point);
    //     if (this.toleranceCheck(color, this.targetColor) && !stack.includes(point)) { stack.push(point); }
    //   });
    //   console.log(stack.length);
    //   const nextPoint = stack.pop();
    //   if (nextPoint) {this.floodFill(nextPoint, stack); }
    // }
}
