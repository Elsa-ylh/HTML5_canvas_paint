import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
// import { PaintBucketAction } from '@app/classes/undo-redo/paint-bucket-action';
import { Vec2 } from '@app/classes/vec2';
// import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';
import { SelectionService } from '@app/services/tools/selection-service/selection-service';

const COLORATTRIBUTES = 4; // r,g,b,a

@Injectable({
    providedIn: 'root',
})

// https://github.com/Tamersoul/magic-wand-js/blob/master/src/MagicWand.js
export class MagicWandService extends SelectionService {
    private selectionBoxCreated: boolean = false;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private canvasResizerService: CanvasResizerService,
        private paintBucketService: PaintBucketService,
    ) {
        super(drawingService);
    }
    tolerance: number = 0; // from 0 to 100 inclusively, look at paint bucket component

    // the starting x and y means where the mouse was clicked down
    /*tslint:disable:cyclomatic-complexity*/
    private selectedFloodFill(x: number, y: number, replacementColor: RGBA): ImageData {
        const pixelStack: Vec2[] = [];
        pixelStack.push({ x, y });
        const pixels: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.canvasResizerService.canvasSize.x,
            this.canvasResizerService.canvasSize.y,
        );
        let linearCords: number = (y * this.canvasResizerService.canvasSize.x + x) * COLORATTRIBUTES;
        const originalColor = {
            red: pixels.data[linearCords],
            green: pixels.data[linearCords + 1],
            blue: pixels.data[linearCords + 2],
            // +3 means at alpha position
            // tslint:disable-next-line:no-magic-numbers
            alpha: pixels.data[linearCords + 3],
        };

        /*
// if current pixel matches clicked color, otherwise, the program is stuck in an infinite loop
if (this.matchFillColor(originalColor, replacementColor)) {
    return;
}
*/

        while (pixelStack.length > 0) {
            const newPixel: Vec2 = pixelStack.shift() as Vec2;
            x = newPixel.x;
            y = newPixel.y;

            linearCords = (y * this.canvasResizerService.canvasSize.x + x) * COLORATTRIBUTES;
            while (
                y-- >= 0 &&
                pixels.data[linearCords] === originalColor.red &&
                pixels.data[linearCords + 1] === originalColor.green &&
                pixels.data[linearCords + 2] === originalColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                linearCords -= this.canvasResizerService.canvasSize.x * COLORATTRIBUTES;
            }
            linearCords += this.canvasResizerService.canvasSize.x * COLORATTRIBUTES;
            y++;

            let reachedLeft = false;
            let reachedRight = false;
            while (
                y++ < this.canvasResizerService.canvasSize.y &&
                pixels.data[linearCords] === originalColor.red &&
                pixels.data[linearCords + 1] === originalColor.green &&
                pixels.data[linearCords + 2] === originalColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                // put selection code
                pixels.data[linearCords] = replacementColor.red;
                pixels.data[linearCords + 1] = replacementColor.green;
                pixels.data[linearCords + 2] = replacementColor.blue;
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] = replacementColor.alpha;

                if (x > 0) {
                    if (
                        pixels.data[linearCords - COLORATTRIBUTES] === originalColor.red &&
                        pixels.data[linearCords - COLORATTRIBUTES + 1] === originalColor.green &&
                        pixels.data[linearCords - COLORATTRIBUTES + 2] === originalColor.blue &&
                        // +3 means at alpha position
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords - COLORATTRIBUTES + 3] === originalColor.alpha
                    ) {
                        if (!reachedLeft) {
                            pixelStack.push({ x: x - 1, y });
                            reachedLeft = true;
                        } else if (reachedLeft) {
                            reachedLeft = false;
                        }
                    }
                }

                if (x < this.canvasResizerService.canvasSize.x - 1) {
                    if (
                        pixels.data[linearCords + COLORATTRIBUTES] === originalColor.red &&
                        pixels.data[linearCords + COLORATTRIBUTES + 1] === originalColor.green &&
                        pixels.data[linearCords + COLORATTRIBUTES + 2] === originalColor.blue &&
                        // +3 means at alpha position
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords + COLORATTRIBUTES + 3] === originalColor.alpha
                    ) {
                        if (!reachedRight) {
                            pixelStack.push({ x: x + 1, y });
                            reachedRight = true;
                        } else if (reachedRight) {
                            reachedRight = false;
                        }
                    }

                    linearCords += this.canvasResizerService.canvasSize.x * COLORATTRIBUTES;
                }
            }
        }
        return pixels;
    }
    /*tslint:enable:cyclomatic-complexity*/

    private selectAllSimilar(x: number, y: number, replacementColor: RGBA): ImageData {
        const pixels: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.canvasResizerService.canvasSize.x,
            this.canvasResizerService.canvasSize.y,
        );
        const linearCords: number = (y * this.canvasResizerService.canvasSize.x + x) * COLORATTRIBUTES;
        const originalColor = {
            red: pixels.data[linearCords],
            green: pixels.data[linearCords + 1],
            blue: pixels.data[linearCords + 2],
            // +3 means at alpha position
            // tslint:disable-next-line:no-magic-numbers
            alpha: pixels.data[linearCords + 3],
        };

        let iterator = 0;
        const atIteratorColor: RGBA = { red: 0, green: 0, blue: 0, alpha: 0 };
        while (iterator <= pixels.data.length) {
            atIteratorColor.red = pixels.data[iterator];
            atIteratorColor.green = pixels.data[iterator + 1];
            atIteratorColor.blue = pixels.data[iterator + 2];
            // +3 means at alpha position
            // tslint:disable-next-line:no-magic-numbers
            atIteratorColor.alpha = pixels.data[iterator + 3];
            if (this.paintBucketService.matchFillColor(originalColor, atIteratorColor)) {
                // put selection code
                pixels.data[iterator] = replacementColor.red;
                pixels.data[iterator + 1] = replacementColor.green;
                pixels.data[iterator + 2] = replacementColor.blue;
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[iterator + 3] = replacementColor.alpha;
            }
            iterator += COLORATTRIBUTES;
        }

        return pixels;
    }

    private createSelectionRectangle(selectedPixels: ImageData): void {
        // const ctx: CanvasRenderingContext2D = this.drawingService.baseCtx;
    }

    /*tslint:disable:cyclomatic-complexity*/
    // private findBounds(image: ImageData): number[] {
    //   let k = 0;
    //   let k1 = 0;
    //   let k2 = 0;
    //   const data = image.data;
    //   const border: number[] = []; // only border points

    //   // walk through inner values except points on the boundary of the image
    //   for (let y = 1; y < image.height - 1; y++) {
    //     for (let x = 1; x < image.width - 1; x++) {
    //       k = y * image.width + x;
    //       if (data[k] === 0) continue; // "white" point isn't the border
    //       k1 = k + image.width; // y + 1
    //       k2 = k - image.width; // y - 1
    //       // check if any neighbor with a "white" color
    //       if (
    //         data[k + 1] === 0 ||
    //         data[k - 1] === 0 ||
    //         data[k1] === 0 ||
    //         data[k1 + 1] === 0 ||
    //         data[k1 - 1] === 0 ||
    //         data[k2] === 0 ||
    //         data[k2 + 1] === 0 ||
    //         data[k2 - 1] === 0
    //       ) {
    //         border.push(k);
    //       }
    //     }
    //   }

    //   // walk through points on the boundary of the image if necessary
    //   // if the "black" point is adjacent to the boundary of the image, it is a border point
    //   for (let y = 0; y < image.height; y++) if (data[y * image.width] === 1) border.push(y * image.width);

    //   for (let x = 0; x < image.width; x++) if (data[x] === 1) border.push(x);
    //   k = image.width - 1;
    //   for (let y = 0; y < image.height; y++) if (data[y * image.width + k] === 1) border.push(y * image.width + k);

    //   k = (image.height - 1) * image.width;
    //   for (let x = 0; x < image.width; x++) if (data[k + x] === 1) border.push(k + x);

    //   return border;
    // }
    /*tslint:enable:cyclomatic-complexity*/

    // private drawSelection(mousePos: Vec2): void {}

    onMouseDown(event: MouseEvent): void {
        // Only near pixels with similar looking colors are painted. For example, a bounded domain is the only place where the paint will be.
        // Outside of the domain, the paint is not there.
        if (event.button === MouseButton.Left) {
            if (!this.selectionBoxCreated) {
                const toBeSelectedPixels: ImageData = this.selectedFloodFill(
                    event.offsetX,
                    event.offsetY,
                    this.paintBucketService.hexToRGBA(this.colorService.primaryColor),
                );
                this.createSelectionRectangle(toBeSelectedPixels);
                this.selectionBoxCreated = true;
                this.image.src = this.getImageURL(toBeSelectedPixels, this.drawingService.canvas.width, this.drawingService.canvas.height);
            }
            if (this.selectionBoxCreated) {
                // const controlPoint: ControlPoint = this.isInControlPoint({ x: event.offsetX, y: event.offsetY });
            }
            this.drawSelection({ x: event.offsetX, y: event.offsetY });
        }

        // The entire canvas is being verified if the target color plus tolerance can be colored with the replacement color.
        if (event.button === MouseButton.Right) {
            this.mouseDown = false;
            const toBeSelectedPixels: ImageData = this.selectAllSimilar(
                event.offsetX,
                event.offsetY,
                this.paintBucketService.hexToRGBA(this.colorService.primaryColor),
            );
            this.createSelectionRectangle(toBeSelectedPixels);
            // toBeSelectedPixels;
            // call non-contiguous selections
            return;
        }
    }

    // The debounce aka onMouseUp even is there so undo-redo knows when to deactivate
    onMouseUp(event: MouseEvent): void {
        return;
    }
}
