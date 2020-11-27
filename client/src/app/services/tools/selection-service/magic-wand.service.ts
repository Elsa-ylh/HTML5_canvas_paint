import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
// import { PaintBucketAction } from '@app/classes/undo-redo/paint-bucket-action';
import { Vec2 } from '@app/classes/vec2';
// import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';
import { SelectionService } from '@app/services/tools/selection-service/selection-service';

enum Bound {
    UPPER,
    LOWER,
    LEFT,
    RIGHT,
}

@Injectable({
    providedIn: 'root',
})

// https://github.com/Tamersoul/magic-wand-js/blob/master/src/MagicWand.js
export class MagicWandService extends SelectionService {
    private replacementColor: RGBA = { red: 101, green: 231, blue: 0, alpha: 1 };
    private readonly COLORATTRIBUTES: number = 4;
    private selectionBoxCreated: boolean = false;

    constructor(drawingService: DrawingService, private canvasResizerService: CanvasResizerService, private paintBucketService: PaintBucketService) {
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
        let linearCords: number = (y * this.canvasResizerService.canvasSize.x + x) * this.COLORATTRIBUTES;
        const originalColor = {
            red: pixels.data[linearCords],
            green: pixels.data[linearCords + 1],
            blue: pixels.data[linearCords + 2],
            // +3 means at alpha position
            // tslint:disable-next-line:no-magic-numbers
            alpha: pixels.data[linearCords + 3],
        };

        while (pixelStack.length > 0) {
            const newPixel: Vec2 = pixelStack.shift() as Vec2;
            x = newPixel.x;
            y = newPixel.y;

            linearCords = (y * this.canvasResizerService.canvasSize.x + x) * this.COLORATTRIBUTES;
            while (
                y-- >= 0 &&
                pixels.data[linearCords] === originalColor.red &&
                pixels.data[linearCords + 1] === originalColor.green &&
                pixels.data[linearCords + 2] === originalColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                linearCords -= this.canvasResizerService.canvasSize.x * this.COLORATTRIBUTES;
            }
            linearCords += this.canvasResizerService.canvasSize.x * this.COLORATTRIBUTES;
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
                pixels.data[linearCords] = replacementColor.red;
                pixels.data[linearCords + 1] = replacementColor.green;
                pixels.data[linearCords + 2] = replacementColor.blue;
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] = replacementColor.alpha;

                if (x > 0) {
                    if (
                        pixels.data[linearCords - this.COLORATTRIBUTES] === originalColor.red &&
                        pixels.data[linearCords - this.COLORATTRIBUTES + 1] === originalColor.green &&
                        pixels.data[linearCords - this.COLORATTRIBUTES + 2] === originalColor.blue &&
                        // +3 means at alpha position
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords - this.COLORATTRIBUTES + 3] === originalColor.alpha
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
                        pixels.data[linearCords + this.COLORATTRIBUTES] === originalColor.red &&
                        pixels.data[linearCords + this.COLORATTRIBUTES + 1] === originalColor.green &&
                        pixels.data[linearCords + this.COLORATTRIBUTES + 2] === originalColor.blue &&
                        // +3 means at alpha position
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords + this.COLORATTRIBUTES + 3] === originalColor.alpha
                    ) {
                        if (!reachedRight) {
                            pixelStack.push({ x: x + 1, y });
                            reachedRight = true;
                        } else if (reachedRight) {
                            reachedRight = false;
                        }
                    }

                    linearCords += this.canvasResizerService.canvasSize.x * this.COLORATTRIBUTES;
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
        const linearCords: number = (y * this.canvasResizerService.canvasSize.x + x) * this.COLORATTRIBUTES;
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
            iterator += this.COLORATTRIBUTES;
        }

        return pixels;
    }

    private preparePreviewLayer(selectedPixels: ImageData): ImageData {
        const size = selectedPixels.width * selectedPixels.height;
        const originalLayer: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.canvasResizerService.canvasSize.x,
            this.canvasResizerService.canvasSize.y,
        );
        const previewLayer = new ImageData(this.canvasResizerService.canvasSize.x, this.canvasResizerService.canvasSize.y);
        for (let i = 0; i < size; ++i) {
            if (
                selectedPixels.data[i * this.COLORATTRIBUTES] === this.replacementColor.red &&
                selectedPixels.data[i * this.COLORATTRIBUTES + 1] === this.replacementColor.green &&
                selectedPixels.data[i * this.COLORATTRIBUTES + 2] === this.replacementColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                selectedPixels.data[i * this.COLORATTRIBUTES + 3] === this.replacementColor.alpha
            ) {
                previewLayer.data[i * this.COLORATTRIBUTES] = originalLayer.data[i * this.COLORATTRIBUTES];
                previewLayer.data[i * this.COLORATTRIBUTES + 1] = originalLayer.data[i * this.COLORATTRIBUTES + 1];
                previewLayer.data[i * this.COLORATTRIBUTES + 2] = originalLayer.data[i * this.COLORATTRIBUTES + 2];
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                previewLayer.data[i * this.COLORATTRIBUTES + 3] = originalLayer.data[i * this.COLORATTRIBUTES + 3];
            } else {
                // rgba(255, 255, 255, 0) means transparent

                previewLayer.data[i * this.COLORATTRIBUTES] = 255;
                previewLayer.data[i * this.COLORATTRIBUTES + 1] = 255;
                previewLayer.data[i * this.COLORATTRIBUTES + 2] = 255;
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                previewLayer.data[i * this.COLORATTRIBUTES + 3] = 0;
            }
        }
        return previewLayer;
    }

    private checkNotTransparentPixel(previewLayer: ImageData, pixelPosition: number, transparentColor: RGBA): boolean {
        return (
            previewLayer.data[pixelPosition] !== transparentColor.red &&
            previewLayer.data[pixelPosition + 1] !== transparentColor.green &&
            previewLayer.data[pixelPosition + 2] !== transparentColor.blue &&
            previewLayer.data[pixelPosition + 3] !== transparentColor.alpha
        );
    }

    private findBound(bound: Bound, previewLayer: ImageData): Vec2 {
        const transparent: RGBA = { red: 255, green: 255, blue: 255, alpha: 0 };
        switch (bound) {
            case Bound.UPPER:
                // go thru all of the lines FROM THE TOP and...
                for (let i = 0; i < previewLayer.height; ++i) {
                    // scan the current line to find a pixel NOT transparent
                    for (let j = 0; j < previewLayer.width; ++j) {
                        if (this.checkNotTransparentPixel(previewLayer, this.COLORATTRIBUTES * (i * previewLayer.width + j), transparent)) {
                            return { x: -1, y: i };
                        }
                    }
                }
                break;
            case Bound.LOWER:
                // go thru all of the lines FROM THE BOTTOM and...
                for (let i = previewLayer.height - 1; i >= 0; --i) {
                    // scan the current line to find a pixel NOT transparent
                    for (let j = 0; j < previewLayer.width; ++j) {
                        if (this.checkNotTransparentPixel(previewLayer, this.COLORATTRIBUTES * (i * previewLayer.width + j), transparent)) {
                            return { x: -1, y: i };
                        }
                    }
                }
                break;
            case Bound.LEFT:
                // go thru all of the columns FROM THE LEFT and ...
                for (let i = 0; i < previewLayer.width; ++i) {
                    // scan the current column to find a pixel NOT transparent
                    for (let j = 0; j < previewLayer.height; ++j) {
                        if (this.checkNotTransparentPixel(previewLayer, this.COLORATTRIBUTES * (j * previewLayer.width + i), transparent)) {
                            return { x: i, y: -1 };
                        }
                    }
                }
                break;
            case Bound.RIGHT:
                // go thru all of the columns FROM THE RIGHT and ...
                for (let i = previewLayer.width - 1; i >= 0; --i) {
                    // scan the current line to find a pixel NOT transparent
                    for (let j = 0; j < previewLayer.height; ++j) {
                        if (this.checkNotTransparentPixel(previewLayer, this.COLORATTRIBUTES * (j * previewLayer.width + i), transparent)) {
                            return { x: i, y: -1 };
                        }
                    }
                }
                break;
        }
        return { x: NaN, y: NaN };
    }

    private createSelectionRectangle(selectedPixels: ImageData): void {
        // const ctx: CanvasRenderingContext2D = this.drawingService.previewCtx;

        // the next steps removes anything other than the selected pixels to become transparent
        // and it keeps the selected pixels in the layer
        const previewLayer: ImageData = this.preparePreviewLayer(selectedPixels);

        const upperBoundPos: Vec2 = this.findBound(Bound.UPPER, previewLayer);
        const lowerBoundPos: Vec2 = this.findBound(Bound.LOWER, previewLayer);
        const leftBoundPos: Vec2 = this.findBound(Bound.LEFT, previewLayer);
        const rightBoundPos: Vec2 = this.findBound(Bound.RIGHT, previewLayer);

        const borders: Vec2[] = [upperBoundPos, lowerBoundPos, leftBoundPos, rightBoundPos];

        // this.createRectangleBorders(borders);

        // ctx.putImageData(previewLayer, 0, 0);
    }

    protected drawSelection(imagePosition: Vec2): void {
        this.drawingService.previewCtx.drawImage(this.image, imagePosition.x, imagePosition.y, this.width, this.height);
        this.drawSelectionRect(imagePosition, Math.abs(this.width), Math.abs(this.height));
    }

    onMouseDown(event: MouseEvent): void {
        console.log(event.offsetX, event.offsetY);
        if (event.button === MouseButton.Left) {
            // if (this.selectionBoxCreated) {
            const toBeSelectedPixels: ImageData = this.selectedFloodFill(event.offsetX, event.offsetY, this.replacementColor);
            this.createSelectionRectangle(toBeSelectedPixels);
            this.selectionBoxCreated = true;
            // this.image.src = this.getImageURL(toBeSelectedPixels, this.drawingService.canvas.width, this.drawingService.canvas.height);
            // this.drawSelection({ x: event.offsetX, y: event.offsetY });
            // }
        }

        // The entire canvas is being verified if the target color plus tolerance can be colored with the replacement color.
        if (event.button === MouseButton.Right) {
            this.mouseDown = false;
            const toBeSelectedPixels: ImageData = this.selectAllSimilar(event.offsetX, event.offsetY, this.replacementColor);
            this.createSelectionRectangle(toBeSelectedPixels);

            return;
        }
    }

    onMouseUp(event: MouseEvent): void {
        return;
    }
}
