import { Injectable } from '@angular/core';
// import { Fill } from '@app/classes/fill';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Copyright all reserved to the respective author. Our work has been highly inspired by him and there is
// is some form of paraphrasing and recoding to make it adapted to our use cases
// https://github.com/williammalone/HTML5-Paint-Bucket-Tool/blob/master/html5-canvas-paint-bucket.js

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    fillColor: string;
    mousePosition: Vec2;
    private tmpVecDown: Vec2;
    private tmpVecUp: Vec2;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    // paintBucketTool: number = 8;
    canvasWidth: number;
    canvasHeigth: number;
    currentColor: string = '#000000';
    colorLayerData: ImageData;
    outlineLayerData: ImageData;
    currentLoadResNum: number = 4;
    radix: number = 16;
    colorAttributs: number = 4; // rgba

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
            this.tmpVecDown = this.mouseDownCoord;
        }
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            // tslint:disable-next-line:no-unused-expression
            // new Fill(
            //     this.drawingService.baseCtx,
            //     this.mouseDownCoord,
            //     this.fillColor,
            //     this.drawingService,
            //     this.colorService,
            //     this.canvasResizerService,
            // );
            console.log('1');
            this.paintAt(this.mouseDownCoord);
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
            this.tmpVecUp = mousePosition;
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

    hexToRgbA(hex: string): number[] {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result !== null) {
            return [
                // tslint:disable-next-line:no-non-null-assertion
                parseInt(result![1], this.radix), // ! to assure that result is not null
                // tslint:disable-next-line:no-non-null-assertion
                parseInt(result![1], this.radix),
                // tslint:disable-next-line:no-non-null-assertion
                parseInt(result![1], this.radix),
                // tslint:disable-next-line:no-magic-numbers
                255,
            ];
        } else {
            throw new Error('null hex');
        }
    }

    matchOultineColor(color: number[]): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return color[0] + color[1] + color[2] < 100 && color[3] === 255;
    }

    matchStartColor(pixelPos: number, startColor: number[]): boolean {
        const red = this.outlineLayerData.data[pixelPos];
        const green = this.outlineLayerData.data[pixelPos + 1];
        const blue = this.outlineLayerData.data[pixelPos + 2];
        // tslint:disable-next-line:no-magic-numbers
        const alpha = this.outlineLayerData.data[pixelPos + 3];

        // if current pixel of outline image is black
        if (this.matchOultineColor([red, green, blue, alpha])) {
            return false;
        }

        // if current pixel matches clicked color
        if (red === startColor[0] && green === startColor[1] && blue === startColor[2]) {
            return true;
        }

        // if current pixel matches new color
        // tslint:disable-next-line: max-line-length
        if (
            this.hexToRgbA(this.currentColor)[0] === red &&
            this.hexToRgbA(this.currentColor)[1] === green &&
            this.hexToRgbA(this.currentColor)[2] === blue
        ) {
            return false;
        }
        return true;
    }

    colorPixel(pixelPos: number, color: number[]): void {
        this.colorLayerData.data[pixelPos] = color[0]; // red
        this.colorLayerData.data[pixelPos + 1] = color[1]; // green
        this.colorLayerData.data[pixelPos + 2] = color[2]; // blue
        // tslint:disable-next-line:no-magic-numbers
        this.colorLayerData.data[pixelPos + 3] = color[3] !== undefined ? color[3] : 255; // alpha
    }

    floodFill(startPos: Vec2, startColor: number[]): void {
        const newPos: Vec2[] = [];
        const pos: Vec2 = { x: 0, y: 0 };
        let pixelPos = 0;
        let reachLeft: boolean;
        let reachRight: boolean;
        const drawingBoundLeft: number = this.tmpVecDown.x; // drawingAreaX
        const drawingBoundTop: number = this.tmpVecDown.y; // drawingAreaY
        const drawingBoundRigth: number = this.tmpVecUp.x - this.tmpVecDown.x - 1;
        const drawingBoundBottom: number = this.tmpVecUp.y - this.tmpVecDown.y - 1;
        const pixelStack: Vec2[] = [];
        pixelStack.push(startPos);
        this.canvasWidth = this.canvasResizerService.canvasSize.x;
        this.canvasHeigth = this.canvasResizerService.canvasSize.y;

        // first position is the one being drawed
        // last one is being removed to be placed first
        while (pixelStack.length !== 0) {
            newPos[0] = pixelStack[pixelStack.length - 1];
            pixelStack.pop();
            pos.x = newPos[0].x;
            pos.y = newPos[0].y;

            // get current pixel position
            pixelPos = (pos.y * this.canvasWidth + pos.x) * this.colorAttributs;

            // Go up as long as the color matches and are inside the canvas
            while (pos.y >= drawingBoundTop && this.matchStartColor(pixelPos, startColor)) {
                pos.y -= 1;
                pixelPos -= this.canvasWidth * this.colorAttributs;
                console.log('2');
            }

            pixelPos += this.canvasWidth * this.colorAttributs;
            pos.y += 1;
            reachLeft = false;
            reachRight = false;

            // Go up as long as the color matches and are inside the canvas
            while (pos.y <= drawingBoundBottom && this.matchStartColor(pixelPos, startColor)) {
                pos.y += 1;
                this.colorPixel(pixelPos, this.hexToRgbA(this.currentColor));
                console.log('3');
                if (pos.x > drawingBoundLeft) {
                    if (this.matchStartColor(pixelPos - this.colorAttributs, startColor)) {
                        if (!reachLeft) {
                            // Add pixel to stack
                            pixelStack.push({ x: pos.x - 1, y: pos.y });
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (pos.x < drawingBoundRigth) {
                    if (this.matchStartColor(pixelPos + this.colorAttributs, startColor)) {
                        if (!reachRight) {
                            // Add pixel to stack
                            pixelStack.push({ x: pos.x + 1, y: pos.y });
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += this.canvasWidth * this.colorAttributs;
            }
        }
    }

    // Start painting with paint bucket tool starting from pixel specified by startX and startY
    paintAt(startPos: Vec2): void {
        this.canvasWidth = this.canvasResizerService.canvasSize.x;
        this.canvasHeigth = this.canvasResizerService.canvasSize.y;

        const pixelPos: number = (startPos.y * this.canvasWidth + startPos.x) * this.colorAttributs;
        const red: number = this.colorLayerData.data[pixelPos];
        const green: number = this.colorLayerData.data[pixelPos + 1];
        const blue: number = this.colorLayerData.data[pixelPos + 2];
        // tslint:disable-next-line:no-magic-numbers
        const alpha: number = this.colorLayerData.data[pixelPos + 3];

        // if (
        //     this.hexToRgbA(this.currentColor)[0] === this.hexToRgbA(this.fillColor)[0] &&
        //     this.hexToRgbA(this.currentColor)[1] === this.hexToRgbA(this.fillColor)[1] &&
        //     this.hexToRgbA(this.currentColor)[2] === this.hexToRgbA(this.fillColor)[2]
        // )
        if (
            this.hexToRgbA(this.currentColor)[0] === red &&
            this.hexToRgbA(this.currentColor)[1] === green &&
            this.hexToRgbA(this.currentColor)[2] === blue
        ) {
            // Return because trying to fill with the same color
            return;
        }
        if (
            this.matchOultineColor([red, green, blue, alpha])
            // if (
            //     this.matchOultineColor([
            //         this.hexToRgbA(this.fillColor)[0],
            //         this.hexToRgbA(this.fillColor)[1],
            //         this.hexToRgbA(this.fillColor)[2],
            //         // tslint:disable-next-line:no-magic-numbers
            //         this.hexToRgbA(this.fillColor)[3],
            //     ])
        ) {
            // Return because clicked outline
            return;
        }

        this.floodFill(startPos, [
            this.hexToRgbA(this.fillColor)[0],
            this.hexToRgbA(this.fillColor)[1],
            this.hexToRgbA(this.fillColor)[2],
            // tslint:disable-next-line:no-magic-numbers
            this.hexToRgbA(this.fillColor)[3],
        ]);
        // this.floodFill(startPos, [red, green, blue]);
    }
}
