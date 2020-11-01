import { Injectable } from '@angular/core';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasResizerService } from '../canvas/canvas-resizer.service';

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    constructor(drawingService: DrawingService, private colorService: ColorService, private cvsResizerService: CanvasResizerService) {
        super(drawingService);
    }

    // https://en.wikipedia.org/wiki/Flood_fill#:~:text=Flood%20fill%2C%20also%20called%20seed,in%20a%20multi%2Ddimensional%20array.
    // https://ben.akrin.com/?p=7888
    // https://ben.akrin.com/canvas_fill/fill_04.html
    // tslint:disable: cyclomatic-complexity
    // tslint:disable: no-magic-numbers
    flood_fill(x: number, y: number, replacementColor: RGBA): void {
        const pixelStack: Vec2[] = [];
        pixelStack.push({ x, y });
        const pixels = this.drawingService.baseCtx.getImageData(0, 0, this.cvsResizerService.canvasSize.x, this.cvsResizerService.canvasSize.y);
        let linearCoords = (y * this.cvsResizerService.canvasSize.x + x) * 4;
        const originalColor = {
            red: pixels.data[linearCoords],
            green: pixels.data[linearCoords + 1],
            blue: pixels.data[linearCoords + 2],
            alpha: pixels.data[linearCoords + 3],
        };

        while (pixelStack.length > 0) {
            const newPixel = pixelStack.shift() as Vec2;
            x = newPixel.x;
            y = newPixel.y;

            linearCoords = (y * this.cvsResizerService.canvasSize.x + x) * 4;
            while (
                y-- >= 0 &&
                pixels.data[linearCoords] === originalColor.red &&
                pixels.data[linearCoords + 1] === originalColor.green &&
                pixels.data[linearCoords + 2] === originalColor.blue &&
                pixels.data[linearCoords + 3] === originalColor.alpha
            ) {
                linearCoords -= this.cvsResizerService.canvasSize.x * 4;
            }
            linearCoords += this.cvsResizerService.canvasSize.x * 4;
            y++;

            let reachedLeft = false;
            let reachedRight = false;
            while (
                y++ < this.cvsResizerService.canvasSize.y &&
                pixels.data[linearCoords] === originalColor.red &&
                pixels.data[linearCoords + 1] === originalColor.green &&
                pixels.data[linearCoords + 2] === originalColor.blue &&
                pixels.data[linearCoords + 3] === originalColor.alpha
            ) {
                pixels.data[linearCoords] = replacementColor.red;
                pixels.data[linearCoords + 1] = replacementColor.green;
                pixels.data[linearCoords + 2] = replacementColor.blue;
                pixels.data[linearCoords + 3] = replacementColor.alpha;

                if (x > 0) {
                    if (
                        pixels.data[linearCoords - 4] === originalColor.red &&
                        pixels.data[linearCoords - 4 + 1] === originalColor.green &&
                        pixels.data[linearCoords - 4 + 2] === originalColor.blue &&
                        pixels.data[linearCoords - 4 + 3] === originalColor.alpha
                    ) {
                        if (!reachedLeft) {
                            pixelStack.push({ x: x - 1, y });
                            reachedLeft = true;
                        }
                    } else if (reachedLeft) {
                        reachedLeft = false;
                    }
                }

                if (x < this.cvsResizerService.canvasSize.x - 1) {
                    if (
                        pixels.data[linearCoords + 4] === originalColor.red &&
                        pixels.data[linearCoords + 4 + 1] === originalColor.green &&
                        pixels.data[linearCoords + 4 + 2] === originalColor.blue &&
                        pixels.data[linearCoords + 4 + 3] === originalColor.alpha
                    ) {
                        if (!reachedRight) {
                            pixelStack.push({ x: x + 1, y });
                            reachedRight = true;
                        }
                    } else if (reachedRight) {
                        reachedRight = false;
                    }
                }

                linearCoords += this.cvsResizerService.canvasSize.x * 4;
            }
        }
        this.drawingService.baseCtx.putImageData(pixels, 0, 0);
    }

    onMouseDown(event: MouseEvent): void {
        this.flood_fill(event.offsetX, event.offsetY);
    }
}
