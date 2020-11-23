import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { PaintBucketAction } from '@app/classes/undo-redo/paint-bucket-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionService } from './selection-service';

const MIN_TOLERANCE = 0;
const MAX_TOLERANCE = 100;

@Injectable({
    providedIn: 'root',
})
export class MagicWandService extends SelectionService {
    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private cvsResizerService: CanvasResizerService,
        private undoRedoService: UndoRedoService,
        private automaticSaveService: AutomaticSaveService,
    ) {
        super(drawingService);
    }
    private radix: number = 16; // radix also means base as hexadecimal for this use case
    private colorAttributes: number = 4; // r,g,b,a
    tolerance: number = 0; // from 0 to 100 inclusively, look at paint bucket component

    // the starting x and y means where the mouse was clicked down
    /*tslint:disable:cyclomatic-complexity*/
    private floodFill(x: number, y: number, replacementColor: RGBA): void {
        const pixelStack: Vec2[] = [];
        pixelStack.push({ x, y });
        const pixels: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.cvsResizerService.canvasSize.x,
            this.cvsResizerService.canvasSize.y,
        );
        let linearCords: number = (y * this.cvsResizerService.canvasSize.x + x) * this.colorAttributes;
        const originalColor = {
            red: pixels.data[linearCords],
            green: pixels.data[linearCords + 1],
            blue: pixels.data[linearCords + 2],
            // +3 means at alpha position
            // tslint:disable-next-line:no-magic-numbers
            alpha: pixels.data[linearCords + 3],
        };

        // if current pixel matches clicked color, otherwise, the program is stuck in an infinite loop
        if (this.matchFillColor(originalColor, replacementColor)) {
            return;
        }

        while (pixelStack.length > 0) {
            const newPixel: Vec2 = pixelStack.shift() as Vec2;
            x = newPixel.x;
            y = newPixel.y;

            linearCords = (y * this.cvsResizerService.canvasSize.x + x) * this.colorAttributes;
            while (
                y-- >= 0 &&
                pixels.data[linearCords] === originalColor.red &&
                pixels.data[linearCords + 1] === originalColor.green &&
                pixels.data[linearCords + 2] === originalColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                linearCords -= this.cvsResizerService.canvasSize.x * this.colorAttributes;
            }
            linearCords += this.cvsResizerService.canvasSize.x * this.colorAttributes;
            y++;

            let reachedLeft = false;
            let reachedRight = false;
            while (
                y++ < this.cvsResizerService.canvasSize.y &&
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
                        pixels.data[linearCords - this.colorAttributes] === originalColor.red &&
                        pixels.data[linearCords - this.colorAttributes + 1] === originalColor.green &&
                        pixels.data[linearCords - this.colorAttributes + 2] === originalColor.blue &&
                        // +3 means at alpha position
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords - this.colorAttributes + 3] === originalColor.alpha
                    ) {
                        if (!reachedLeft) {
                            pixelStack.push({ x: x - 1, y });
                            reachedLeft = true;
                        } else if (reachedLeft) {
                            reachedLeft = false;
                        }
                    }
                }

                if (x < this.cvsResizerService.canvasSize.x - 1) {
                    if (
                        pixels.data[linearCords + this.colorAttributes] === originalColor.red &&
                        pixels.data[linearCords + this.colorAttributes + 1] === originalColor.green &&
                        pixels.data[linearCords + this.colorAttributes + 2] === originalColor.blue &&
                        // +3 means at alpha position
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords + this.colorAttributes + 3] === originalColor.alpha
                    ) {
                        if (!reachedRight) {
                            pixelStack.push({ x: x + 1, y });
                            reachedRight = true;
                        } else if (reachedRight) {
                            reachedRight = false;
                        }
                    }

                    linearCords += this.cvsResizerService.canvasSize.x * this.colorAttributes;
                }
            }
        }
        this.drawingService.baseCtx.putImageData(pixels, 0, 0);
        // undo-redo
        const paintBucketAction = new PaintBucketAction(pixels, this.drawingService);
        this.undoRedoService.addUndo(paintBucketAction);
        this.undoRedoService.clearRedo();
        this.automaticSaveService.save();
    }
    /*tslint:enable:cyclomatic-complexity*/

    // transform #000000 in {red : 0, green : 0, blue : 0, alpha : 0}
    hexToRGBA(hex: string): RGBA {
        // tslint:disable-next-line:no-magic-numbers
        const r: number = parseInt(hex.slice(1, 3), this.radix);
        // tslint:disable-next-line:no-magic-numbers
        const g: number = parseInt(hex.slice(3, 5), this.radix);
        // tslint:disable-next-line:no-magic-numbers
        const b: number = parseInt(hex.slice(5, 7), this.radix);
        // tslint:disable-next-line:no-magic-numbers
        const a = 255;

        return { red: r, green: g, blue: b, alpha: a };
    }

    private matchFillColor(currentColor: RGBA, targetColor: RGBA): boolean {
        let matchFillColor = true;
        const tolerance = this.toleranceToRGBA();
        matchFillColor = matchFillColor && targetColor.red >= currentColor.red - tolerance && targetColor.red <= currentColor.red + tolerance;
        matchFillColor = matchFillColor && targetColor.green >= currentColor.green - tolerance && targetColor.green <= currentColor.green + tolerance;
        matchFillColor = matchFillColor && targetColor.blue >= currentColor.blue - tolerance && targetColor.blue <= currentColor.blue + tolerance;

        return matchFillColor;
    }

    private paintAllSimilar(x: number, y: number, replacementColor: RGBA): void {
        const pixels: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.cvsResizerService.canvasSize.x,
            this.cvsResizerService.canvasSize.y,
        );
        const linearCords: number = (y * this.cvsResizerService.canvasSize.x + x) * this.colorAttributes;
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
            if (this.matchFillColor(originalColor, atIteratorColor)) {
                // put selection code
                pixels.data[iterator] = replacementColor.red;
                pixels.data[iterator + 1] = replacementColor.green;
                pixels.data[iterator + 2] = replacementColor.blue;
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[iterator + 3] = replacementColor.alpha;
            }
            iterator += this.colorAttributes;
        }

        this.drawingService.baseCtx.putImageData(pixels, 0, 0);
        // undo-redo
        const paintBucketAction = new PaintBucketAction(pixels, this.drawingService);
        this.undoRedoService.addUndo(paintBucketAction);
        this.undoRedoService.clearRedo();
    }

    private toleranceToRGBA(): number {
        if (this.tolerance === MIN_TOLERANCE) return 0;
        // tslint:disable-next-line:no-magic-numbers
        if (this.tolerance === MAX_TOLERANCE) return 255;
        // 255 is the maximum number for a single r, g, b or a
        // tslint:disable-next-line:no-magic-numbers
        return (this.tolerance / 100) * 255;
    }

    onMouseDown(event: MouseEvent): void {
        // Only near pixels with similar looking colors are painted. For example, a bounded domain is the only place where the paint will be.
        // Outside of the domain, the paint is not there.
        if (event.button === MouseButton.Left) {
            this.mouseDown = false;
            this.floodFill(event.offsetX, event.offsetY, this.hexToRGBA(this.colorService.primaryColor));
            // call contigous selection
            return;
        }
        // The entire canvas is being verified if the target color plus tolerance can be colored with the replacement color.
        if (event.button === MouseButton.Right) {
            this.mouseDown = false;
            this.paintAllSimilar(event.offsetX, event.offsetY, this.hexToRGBA(this.colorService.primaryColor));
            // call non-contigus selections
            return;
        }
    }

    // The rebounce aka onMouseUp even is there so undoredo knows when to deactivate
    onMouseUp(event: MouseEvent): void {
        return;
    }
}
