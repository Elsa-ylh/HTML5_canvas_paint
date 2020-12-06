import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
// import { PaintBucketAction } from '@app/classes/undo-redo/paint-bucket-action';
import { Vec2 } from '@app/classes/vec2';
// import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
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

// tslint:disable:cyclomatic-complexity
export class MagicWandService extends SelectionService {
    private replacementColor: RGBA = { red: 101, green: 231, blue: 0, alpha: 1 };
    private readonly COLORATTRIBUTES: number = 4;
    // private selectionBoxCreated: boolean = false;

    constructor(
        drawingService: DrawingService,
        private canvasResizerService: CanvasResizerService,
        private paintBucketService: PaintBucketService,
        protected magnetismService: MagnetismService,
    ) {
        super(drawingService, magnetismService);
    }
    tolerance: number = 0; // from 0 to 100 inclusively, look at paint bucket component

    // the starting x and y means where the mouse was clicked down
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

    private preparePreviewLayer(coloredPixels: ImageData): ImageData {
        const size = coloredPixels.width * coloredPixels.height;
        const originalLayer: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.canvasResizerService.canvasSize.x,
            this.canvasResizerService.canvasSize.y,
        );
        const previewLayer = new ImageData(this.canvasResizerService.canvasSize.x, this.canvasResizerService.canvasSize.y);
        for (let i = 0; i < size; ++i) {
            if (
                coloredPixels.data[i * this.COLORATTRIBUTES] === this.replacementColor.red &&
                coloredPixels.data[i * this.COLORATTRIBUTES + 1] === this.replacementColor.green &&
                coloredPixels.data[i * this.COLORATTRIBUTES + 2] === this.replacementColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                coloredPixels.data[i * this.COLORATTRIBUTES + 3] === this.replacementColor.alpha
            ) {
                previewLayer.data[i * this.COLORATTRIBUTES] = originalLayer.data[i * this.COLORATTRIBUTES];
                previewLayer.data[i * this.COLORATTRIBUTES + 1] = originalLayer.data[i * this.COLORATTRIBUTES + 1];
                previewLayer.data[i * this.COLORATTRIBUTES + 2] = originalLayer.data[i * this.COLORATTRIBUTES + 2];
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                previewLayer.data[i * this.COLORATTRIBUTES + 3] = originalLayer.data[i * this.COLORATTRIBUTES + 3];
            } else {
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                previewLayer.data[i * this.COLORATTRIBUTES + 3] = 0;
            }
        }
        return previewLayer;
    }

    private checkNotTransparentPixel(previewLayer: ImageData, pixelPosition: number, transparentColor: RGBA): boolean {
        return (
            // tslint:disable-next-line:no-magic-numbers
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

    // https://stackoverflow.com/a/55196211
    private snipSelection(previewLayer: ImageData, upperCornerPosition: Vec2, selectionDimension: Vec2): string {
        const cut = document.createElement('canvas');
        cut.width = selectionDimension.x;
        cut.height = selectionDimension.y;
        const ctx = cut.getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(previewLayer, -upperCornerPosition.x, -upperCornerPosition.y);
        return cut.toDataURL();
    }

    private saveSelectionData(coloredPixels: ImageData): void {
        // the next steps removes anything other than the selected pixels to become transparent
        // and it keeps the selected pixels in the layer
        const previewLayer: ImageData = this.preparePreviewLayer(coloredPixels);

        const upperBoundPos: Vec2 = this.findBound(Bound.UPPER, previewLayer);
        const lowerBoundPos: Vec2 = this.findBound(Bound.LOWER, previewLayer);
        const leftBoundPos: Vec2 = this.findBound(Bound.LEFT, previewLayer);
        const rightBoundPos: Vec2 = this.findBound(Bound.RIGHT, previewLayer);

        this.selection.imagePosition = { x: leftBoundPos.x, y: upperBoundPos.y } as Vec2;
        this.selection.endingPos = { x: rightBoundPos.x, y: lowerBoundPos.y } as Vec2;

        this.selection.image = new Image();
        this.selection.image.src = this.snipSelection(
            previewLayer,
            this.selection.imagePosition as Vec2,
            { x: rightBoundPos.x - leftBoundPos.x, y: lowerBoundPos.y - upperBoundPos.y } as Vec2,
        );
    }

    drawSelection(): void {
        if (this.scaled) {
            this.flipImage();
            this.scaled = false;
        }
        this.drawingService.previewCtx.save();
        this.drawingService.previewCtx.drawImage(
            this.selection.image,
            this.selection.imagePosition.x,
            this.selection.imagePosition.y,
            this.selection.width,
            this.selection.height,
        );
        this.drawingService.previewCtx.restore();
        this.drawSelectionRect(this.selection.imagePosition, this.selection.width, this.selection.height);
    }

    onMouseDown(event: MouseEvent): void {
        this.clearEffectTool();
        if (event.button === MouseButton.Left) {
            this.mouseDown = true;
            const coloredToBeSelectedPixels: ImageData = this.selectedFloodFill(event.offsetX, event.offsetY, this.replacementColor);
            this.saveSelectionData(coloredToBeSelectedPixels);
            return;
        }

        // The entire canvas is being verified if the target color plus tolerance can be colored with the replacement color.
        if (event.button === MouseButton.Right) {
            this.mouseDown = true;
            const coloredToBeSelectedPixels: ImageData = this.selectAllSimilar(event.offsetX, event.offsetY, this.replacementColor);
            this.saveSelectionData(coloredToBeSelectedPixels);
            console.log(this.selection.image.src);
            return;
        }
    }

    onMouseUp(event: MouseEvent): void {}
}
