import { AfterViewInit, Injectable } from '@angular/core';
// import { Fill } from '@app/classes/fill';
import { MouseButton } from '@app/classes/mouse-button';
import { Point2d } from '@app/classes/point2d';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Copyright all reserved to the respective author. Our work has been highly inspired by him and there is
// is some form of paraphrasing and recoding to make it adapted to our use cases
// https://github.com/williammalone/HTML5-Paint-Bucket-Tool/blob/master/html5-canvas-paint-bucket.js

/* tslint:disable:max-file-line-count*/

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool implements AfterViewInit {
    constructor(drawingService: DrawingService, private colorService: ColorService, private canvasResizerService: CanvasResizerService) {
        super(drawingService);
    }
    fillColor: string;
    mousePosition: Vec2;
    // private tmpVecDown: Vec2;
    // private tmpVecUp: Vec2;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    // paintBucketTool: number = 8;
    canvasWidth: number = this.canvasResizerService.canvasSize.x;
    canvasHeight: number = this.canvasResizerService.canvasSize.y;
    currentColor: RGBA;
    targetColor: RGBA;
    colorLayerData: ImageData;
    outlineLayerData: ImageData;
    imageData: ImageData;
    currentLoadResNum: number = 4;
    radix: number = 16;
    colorAttributs: number = 4; // rgba
    pixelStack: Vec2[] = [];

    ngAfterViewInit(): void {
        this.colorLayerData = this.drawingService.baseCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.outlineLayerData = this.drawingService.baseCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.imageData = this.drawingService.baseCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.clearEffectTool();
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.fillColor = this.colorService.primaryColor;
        this.pixelStack.push(new Point2d(event.offsetX, event.offsetY));
        this.targetColor = this.colorService.getColor(new Point2d(event.offsetX, event.offsetY) as Vec2, this.drawingService.baseCtx);
        if (this.mouseEnter) {
            this.onMouseUp(event);
            // this.tmpVecDown = this.mouseDownCoord;
        }
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            // this.tmpVecDown = this.mouseDownCoord;
            // tslint:disable-next-line:no-unused-expression
            // new Fill(
            //     this.drawingService.baseCtx,
            //     this.mouseDownCoord,
            //     this.fillColor,
            //     this.drawingService,
            //     this.colorService,
            //     this.canvasResizerService,
            // );
            // console.log(this.tmpVecDown);

            // this.paintAt(this.mouseDownCoord);
            this.floodFill2(this.imageData, this.hexToRgbA(this.fillColor), this.mouseDownCoord.x, this.mouseDownCoord.y);
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
            // this.tmpVecUp = this.mousePosition;
            // console.log(this.tmpVecUp);
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

    hexToRgbA(hex: string): RGBA {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result !== null) {
            return {
                // tslint:disable-next-line:no-non-null-assertion
                red: parseInt(result![1], this.radix), // ! to assure that result is not null
                // tslint:disable-next-line:no-non-null-assertion
                green: parseInt(result![1], this.radix),
                // tslint:disable-next-line:no-non-null-assertion
                blue: parseInt(result![1], this.radix),
                // tslint:disable-next-line:no-magic-numbers
                alpha: 255,
            };
        } else {
            throw new Error('null hex');
        }
    }

    // matchOultineColor(color: number[]): boolean {
    //     // tslint:disable-next-line:no-magic-numbers
    //     return color[0] + color[1] + color[2] < 100 && color[3] === 255;
    // }

    // matchStartColor(pixelPos: number, startColor: RGBA): boolean {
    //     let red = this.outlineLayerData.data[pixelPos];
    //     let green = this.outlineLayerData.data[pixelPos + 1];
    //     let blue = this.outlineLayerData.data[pixelPos + 2];
    //     // tslint:disable-next-line:no-magic-numbers
    //     const alpha = this.outlineLayerData.data[pixelPos + 3];

    //     // if current pixel of outline image is black
    //     if (this.matchOultineColor([red, green, blue, alpha])) {
    //         return false;
    //     }

    //     red = this.colorLayerData.data[pixelPos];
    //     green = this.colorLayerData.data[pixelPos + 1];
    //     blue = this.colorLayerData.data[pixelPos + 2];

    //     // if current pixel matches clicked color
    //     if (red === startColor.red && green === startColor.green && blue === startColor.blue) {
    //         return true;
    //     }

    //     // if current pixel matches new color
    //     // tslint:disable-next-line: max-line-length
    //     if (
    //         this.currentColor.red === red &&
    //         this.currentColor.green === green &&
    //         this.currentColor.blue === blue
    //     ) {
    //         return false;
    //     }
    //     return true;
    // }

    // colorPixel(pixelPos: number, color: RGBA): void {
    //     this.colorLayerData.data[pixelPos] = color.red; // red
    //     this.colorLayerData.data[pixelPos + 1] = color.green; // green
    //     this.colorLayerData.data[pixelPos + 2] = color.blue; // blue
    //     // tslint:disable-next-line:no-magic-numbers
    //     this.colorLayerData.data[pixelPos + 3] = color.alpha !== undefined ? color.alpha : 255; // alpha
    // }

    // floodFill(startPos: Vec2, startColor: RGBA): void {
    //     const newPos: Vec2[] = [{ x: 0, y: 0 }];
    //     const pos: Vec2 = { x: 0, y: 0 };
    //     let pixelPos = 0;
    //     let reachLeft: boolean;
    //     let reachRight: boolean;
    //     console.log('down :', this.tmpVecDown);
    //     console.log('up :', this.tmpVecUp);
    //     const drawingBoundLeft: number = this.tmpVecDown.x; // drawingAreaX
    //     const drawingBoundTop: number = this.tmpVecDown.y; // drawingAreaY
    //     const drawingBoundRigth: number = this.tmpVecUp.x - this.tmpVecDown.x - 1;
    //     const drawingBoundBottom: number = this.tmpVecUp.y - this.tmpVecDown.y - 1;
    //     const pixelStack: Vec2[] = [startPos];
    //     // pixelStack.push(startPos);

    //     // first position is the one being drawed
    //     // last one is being removed to be placed first
    //     while (pixelStack.length !== 0) {
    //         // newPos[0] = pixelStack[pixelStack.length - 1];
    //         pixelStack.pop();
    //         pos.x = newPos[0].x;
    //         pos.y = newPos[0].y;

    //         // get current pixel position
    //         pixelPos = (pos.y * this.canvasWidth + pos.x) * this.colorAttributs;

    //         // Go up as long as the color matches and are inside the canvas
    //         while (pos.y >= drawingBoundTop && this.matchStartColor(pixelPos, startColor)) {
    //             pos.y -= 1;
    //             pixelPos -= this.canvasWidth * this.colorAttributs;
    //             console.log('2');
    //         }

    //         pixelPos += this.canvasWidth * this.colorAttributs;
    //         pos.y += 1;
    //         reachLeft = false;
    //         reachRight = false;

    //         // Go up as long as the color matches and are inside the canvas
    //         while (pos.y <= drawingBoundBottom && this.matchStartColor(pixelPos, startColor)) {
    //             pos.y += 1;
    //             this.colorPixel(pixelPos, this.currentColor);
    //             console.log('3');
    //             if (pos.x > drawingBoundLeft) {
    //                 if (this.matchStartColor(pixelPos - this.colorAttributs, startColor)) {
    //                     if (!reachLeft) {
    //                         // Add pixel to stack
    //                         pixelStack.push({ x: pos.x - 1, y: pos.y });
    //                         reachLeft = true;
    //                     }
    //                 } else if (reachLeft) {
    //                     reachLeft = false;
    //                 }
    //             }

    //             if (pos.x < drawingBoundRigth) {
    //                 if (this.matchStartColor(pixelPos + this.colorAttributs, startColor)) {
    //                     if (!reachRight) {
    //                         // Add pixel to stack
    //                         pixelStack.push({ x: pos.x + 1, y: pos.y });
    //                         reachRight = true;
    //                     }
    //                 } else if (reachRight) {
    //                     reachRight = false;
    //                 }
    //             }

    //             pixelPos += this.canvasWidth * this.colorAttributs;
    //         }
    //     }
    // }

    // // floodFill(pos: Point2d, stack: Point2d[]): void {
    // //   if (this.stroke.includes(pos)) { return; }
    // //   this.setColor(pos);
    // //   this.stroke.push(pos);
    // //   const cardinalPoints: Point2d[] = [{x: pos.x, y: pos.y - 1}, {x: pos.x + 1, y: pos.y},
    // //                                      {x: pos.x, y: pos.y + 1}, {x: pos.x - 1, y: pos.y}];
    // //   cardinalPoints.forEach( (point) => {
    // //     const color = this.getColor(point);
    // //     if (this.toleranceCheck(color, this.targetColor) && !stack.includes(point)) { stack.push(point); }
    // //   });
    // //   console.log(stack.length);
    // //   const nextPoint = stack.pop();
    // //   if (nextPoint) {this.floodFill(nextPoint, stack); }
    // // }

    // // Start painting with paint bucket tool starting from pixel specified by startX and startY
    // paintAt(startPos: Vec2): void {
    //     this.canvasWidth = this.canvasResizerService.canvasSize.x;
    //     this.canvasHeight = this.canvasResizerService.canvasSize.y;
    //     this.colorLayerData = this.drawingService.baseCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);

    //     const pixelPos: number = (startPos.y * this.canvasWidth + startPos.x) * this.colorAttributs;
    //     const red: number = this.colorLayerData.data[pixelPos];
    //     const green: number = this.colorLayerData.data[pixelPos + 1];
    //     const blue: number = this.colorLayerData.data[pixelPos + 2];
    //     // tslint:disable-next-line:no-magic-numbers
    //     const alpha: number = this.colorLayerData.data[pixelPos + 3];

    //     // if (
    //     //     this.hexToRgbA(this.currentColor)[0] === this.hexToRgbA(this.fillColor)[0] &&
    //     //     this.hexToRgbA(this.currentColor)[1] === this.hexToRgbA(this.fillColor)[1] &&
    //     //     this.hexToRgbA(this.currentColor)[2] === this.hexToRgbA(this.fillColor)[2]
    //     // )
    //     if (
    //         this.currentColor.red === red &&
    //         this.currentColor.green === green &&
    //         this.currentColor.blue === blue
    //     ) {
    //         // Return because trying to fill with the same color
    //         return;
    //     }
    //     if (
    //         this.matchOultineColor([red, green, blue, alpha])
    //         // if (
    //         //     this.matchOultineColor([
    //         //         this.hexToRgbA(this.fillColor)[0],
    //         //         this.hexToRgbA(this.fillColor)[1],
    //         //         this.hexToRgbA(this.fillColor)[2],
    //         //         // tslint:disable-next-line:no-magic-numbers
    //         //         this.hexToRgbA(this.fillColor)[3],
    //         //     ])
    //     ) {
    //         // Return because clicked outline
    //         return;
    //     }

    //     this.floodFill(startPos, this.hexToRgbA(this.fillColor))
    //     // this.floodFill(startPos, [red, green, blue]);
    // }

    getColorAtPixel(imageData2: ImageData, x: number, y: number): RGBA {
        const { width = 0, data } = imageData2;

        return {
            red: data[this.colorAttributs * (width * y + x) + 0],
            green: data[this.colorAttributs * (width * y + x) + 1],
            blue: data[this.colorAttributs * (width * y + x) + 2],
            // tslint:disable-next-line:no-magic-numbers
            alpha: data[this.colorAttributs * (width * y + x) + 3],
        };
    }

    setColorAtPixel(imageData: ImageData, x: number, y: number, color: RGBA): void {
        const { width = 0, data } = imageData;
        // & 0xff is ised to have a signed value
        /* tslint:disable:no-bitwise */
        // tslint:disable-next-line:no-magic-numbers
        data[this.colorAttributs * (width * y + x) + 0] = color.red & 0xff;
        // tslint:disable-next-line:no-magic-numbers
        data[this.colorAttributs * (width * y + x) + 1] = color.green & 0xff;
        // tslint:disable-next-line:no-magic-numbers
        data[this.colorAttributs * (width * y + x) + 2] = color.blue & 0xff;
        // tslint:disable-next-line:no-magic-numbers
        data[this.colorAttributs * (width * y + x) + 3] = color.alpha & 0xff;
        /* tslint:enable:no-bitwise */
    }

    colorMatch(currentColor: RGBA, targetColor: RGBA): boolean {
        return (
            currentColor.red === targetColor.red &&
            currentColor.green === targetColor.green &&
            currentColor.blue === targetColor.blue &&
            currentColor.alpha === targetColor.alpha
        );
    }

    floodFill2(imageData2: ImageData, newColor: RGBA, x: number, y: number): void {
        const { width = 0, height = 0 }: ImageData = imageData2;
        const stack = [];
        const baseColor: RGBA = this.getColorAtPixel(imageData2, x, y);
        let operator: Vec2 = { x, y };

        // Check if base color and new color are the same
        if (this.colorMatch(baseColor, newColor)) {
            return;
        }

        // Add the clicked location to stack
        stack.push({ x: operator.x, y: operator.y });

        while (stack.length) {
            operator = stack.pop() as Vec2;
            // let contiguousDown = true // Vertical is assumed to be true
            let contiguousUp = true; // Vertical is assumed to be true
            let contiguousLeft = false;
            let contiguousRight = false;

            // Move to top most contiguousDown pixel
            while (contiguousUp && operator.y >= 0) {
                operator.y--;
                contiguousUp = this.colorMatch(this.getColorAtPixel(imageData2, operator.x, operator.y), baseColor);
            }

            // Move downward
            while (this.mouseDown && operator.y < height) {
                this.setColorAtPixel(imageData2, operator.x, operator.y, newColor);

                // Check left
                if (operator.x - 1 >= 0 && this.colorMatch(this.getColorAtPixel(imageData2, operator.x - 1, operator.y), baseColor)) {
                    if (!contiguousLeft) {
                        contiguousLeft = true;
                        stack.push({ x: operator.x - 1, y: operator.y });
                    }
                } else {
                    contiguousLeft = false;
                }

                // Check right
                if (operator.x + 1 < width && this.colorMatch(this.getColorAtPixel(imageData2, operator.x + 1, operator.y), baseColor)) {
                    if (!contiguousRight) {
                        stack.push({ x: operator.x + 1, y: operator.y });
                        contiguousRight = true;
                    }
                } else {
                    contiguousRight = false;
                }

                operator.y++;
                this.mouseDown = this.colorMatch(this.getColorAtPixel(imageData2, operator.x, operator.y), baseColor);
            }
        }

        // const imageData = this.drawingService.baseCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);

        // const col = {red: 0xff, green: 0xff, blue: 0x0, alpha: 0xff};

        //   this.drawingService.baseCtx.addEventListener('click', (event: { clientX: number; clientY: number; }) => {
        //   const rect = this.drawingService.baseCtx.getBoundingClientRect()
        //   const x = Math.round(event.clientX - rect.left)
        //   const y = Math.round(event.clientY - rect.top)

        //  this.drawingService.baseCtx.putImageData(imageData, 0, 0)
        // })
    }
}
