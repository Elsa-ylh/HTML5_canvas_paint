import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { ICON_WIDTH, SIDEBAR_WIDTH } from '@app/classes/resize-canvas';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
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
    lineWidth: number = 1;
    fillColor: string;
    mousePosition: Vec2;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    DEFAULT_WIDTH: number = (window.innerWidth - SIDEBAR_WIDTH - ICON_WIDTH) / 2;
    DEFAULT_HEIGHT: number = window.innerHeight / 2;
    canvasSize: Vec2 = { x: this.DEFAULT_WIDTH, y: this.DEFAULT_HEIGHT };
    targetColor: RGBA;
    // visited: Number = new Array(1)[1000];
    colorAttributs: number = 4;

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

    // onMouseDown(event: MouseEvent): void {
    //   this.stack.push(new vec2(event.offsetX, event.offsetY));
    //   this.targetColor = this.colorService.getColor(new vec2 (event.offsetX, event.offsetY), this.drawingService.baseCtx);

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

    // cnt : number = 0;
    // row : number;
    // col : number;
    // image : Number = new Array(2) [1000][1000];
    // visited : Boolean = new Array(2) [1000][1000];
    // res : Number = new Array(1) [1000];

    // valid( i : number, j : number) : boolean
    // {
    //     if(i<0 || i>=this.row || j<0 || j>=this.col)
    //         return false;
    //     else
    //         return true;
    // }

    // floodFill( i : number, j: number, idxValue : number)
    // {
    //     if(this.valid(i,j) == false)     //Base case
    //         return;
    //     if(this.image[i][j] != idxValue)
    //         return;
    //     if(this.image[i][j] == idxValue)
    //         this.cnt++;
    //     this.visited[i][j] = 1;               //Current node is marked as visited.
    //     this.image[i][j] = -100;
    //     this.floodFill(i-1,j,idxValue);
    //     this.floodFill(i+1,j,idxValue);
    //     this.floodFill(i,j-1,idxValue);
    //     this.floodFill(i,j+1,idxValue);
    //     this.floodFill(i-1,j-1,idxValue);
    //     this.floodFill(i-1,j+1,idxValue);
    //     this.floodFill(i+1,j-1,idxValue);
    //     this.floodFill(i+1,j+1,idxValue);
    // }

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

    // Get current pixel position
    getPixel(position: Vec2, ctx: CanvasRenderingContext2D): RGBA {
        const imageData = ctx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y).data;
        if (position.x < 0 || position.y < 0 || this.canvasSize.x > 0 || this.canvasSize.y > 0) {
            // tslint:disable-next-line:no-magic-numbers
            return { red: imageData[-1], green: imageData[-1], blue: imageData[-1], alpha: 0 }; // impossible color
        } else {
            const offset = (position.y * this.canvasSize.x + position.x) * this.colorAttributs;
            // tslint:disable-next-line:no-magic-numbers
            return { red: imageData[offset], green: imageData[offset + 1], blue: imageData[offset + 2], alpha: imageData[offset + 3] };
        }
    }
}
