import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

const MAX_TOLERANCE = 100;

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    constructor(drawingService: DrawingService, private colorService: ColorService, private cvsResizerService: CanvasResizerService) {
        super(drawingService);
    }
    radix: number = 16;
    colorAttributs: number = 4; // r,g,b,a
    oldColor: RGBA;
    mouseOut: boolean = false;
    tolerance: number = 0;

    // https://en.wikipedia.org/wiki/Flood_fill#:~:text=Flood%20fill%2C%20also%20called%20seed,in%20a%20multi%2Ddimensional%20array.
    // https://ben.akrin.com/?p=7888
    // https://ben.akrin.com/canvas_fill/fill_04.html

    /*tslint:disable:cyclomatic-complexity*/
    floodFill(x: number, y: number, replacementColor: RGBA): void {
        const pixelStack: Vec2[] = [];
        pixelStack.push({ x, y });
        const pixels: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.cvsResizerService.canvasSize.x,
            this.cvsResizerService.canvasSize.y,
        );
        let linearCords: number = (y * this.cvsResizerService.canvasSize.x + x) * this.colorAttributs;
        const originalColor = {
            red: pixels.data[linearCords],
            green: pixels.data[linearCords + 1],
            blue: pixels.data[linearCords + 2],
            // tslint:disable-next-line:no-magic-numbers
            alpha: pixels.data[linearCords + 3],
        };

        // if current pixel matches clicked color
        if (this.matchFillColor(originalColor, replacementColor)) {
            return;
        }

        while (pixelStack.length > 0) {
            const newPixel: Vec2 = pixelStack.shift() as Vec2;
            x = newPixel.x;
            y = newPixel.y;

            linearCords = (y * this.cvsResizerService.canvasSize.x + x) * this.colorAttributs;
            while (
                y-- >= 0 &&
                pixels.data[linearCords] === originalColor.red &&
                pixels.data[linearCords + 1] === originalColor.green &&
                pixels.data[linearCords + 2] === originalColor.blue &&
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                linearCords -= this.cvsResizerService.canvasSize.x * this.colorAttributs;
            }
            linearCords += this.cvsResizerService.canvasSize.x * this.colorAttributs;
            y++;

            let reachedLeft = false;
            let reachedRight = false;
            while (
                y++ < this.cvsResizerService.canvasSize.y &&
                pixels.data[linearCords] === originalColor.red &&
                pixels.data[linearCords + 1] === originalColor.green &&
                pixels.data[linearCords + 2] === originalColor.blue &&
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                pixels.data[linearCords] = replacementColor.red;
                pixels.data[linearCords + 1] = replacementColor.green;
                pixels.data[linearCords + 2] = replacementColor.blue;
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] = replacementColor.alpha;

                if (x > 0) {
                    if (
                        pixels.data[linearCords - this.colorAttributs] === originalColor.red &&
                        pixels.data[linearCords - this.colorAttributs + 1] === originalColor.green &&
                        pixels.data[linearCords - this.colorAttributs + 2] === originalColor.blue &&
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords - this.colorAttributs + 3] === originalColor.alpha
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
                        pixels.data[linearCords + this.colorAttributs] === originalColor.red &&
                        pixels.data[linearCords + this.colorAttributs + 1] === originalColor.green &&
                        pixels.data[linearCords + this.colorAttributs + 2] === originalColor.blue &&
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords + this.colorAttributs + 3] === originalColor.alpha
                    ) {
                        if (!reachedRight) {
                            pixelStack.push({ x: x + 1, y });
                            reachedRight = true;
                        }
                    } else if (reachedRight) {
                        reachedRight = false;
                    }
                }

                linearCords += this.cvsResizerService.canvasSize.x * this.colorAttributs;
            }
        }
        this.drawingService.baseCtx.putImageData(pixels, 0, 0);
    }
    /*tslint:enable:cyclomatic-complexity*/

    // transform #000000 in {red : 0, green : 0, blue : 0, alpha : 0}
    hexToRgbA(hex: string): RGBA {
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

    matchFillColor(currentColor: RGBA, targetColor: RGBA): boolean {
        let matchFillColor = true;
        const tolerance = this.toleranceToRGBA();
        matchFillColor = matchFillColor && targetColor.red >= currentColor.red - tolerance && targetColor.red <= currentColor.red + tolerance;
        matchFillColor = matchFillColor && targetColor.green >= currentColor.green - tolerance && targetColor.green <= currentColor.green + tolerance;
        matchFillColor = matchFillColor && targetColor.blue >= currentColor.blue - tolerance && targetColor.blue <= currentColor.blue + tolerance;

        return matchFillColor;
    }

    fill(x: number, y: number, replacementColor: RGBA): void {
        const pixels: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.cvsResizerService.canvasSize.x,
            this.cvsResizerService.canvasSize.y,
        );
        const linearCords: number = (y * this.cvsResizerService.canvasSize.x + x) * this.colorAttributs;
        const originalColor = {
            red: pixels.data[linearCords],
            green: pixels.data[linearCords + 1],
            blue: pixels.data[linearCords + 2],
            // tslint:disable-next-line:no-magic-numbers
            alpha: pixels.data[linearCords + 3],
        };

        let iterator = 0;
        let atIteratorColor: RGBA = { red: 0, green: 0, blue: 0, alpha: 1 };
        while (iterator <= pixels.data.length) {
            atIteratorColor.red = pixels.data[iterator];
            atIteratorColor.green = pixels.data[iterator + 1];
            atIteratorColor.blue = pixels.data[iterator + 2];
            atIteratorColor.alpha = pixels.data[iterator + 3];
            if (this.matchFillColor(originalColor, atIteratorColor)) {
                pixels.data[iterator] = replacementColor.red;
                pixels.data[iterator + 1] = replacementColor.green;
                pixels.data[iterator + 2] = replacementColor.blue;
                pixels.data[iterator + 3] = replacementColor.alpha;
            }
            iterator += 4;
        }

        this.drawingService.baseCtx.putImageData(pixels, 0, 0);
    }

    PaintPixel(imageData: ImageData, pos: number): void {
        const replacementColor: RGBA = this.hexToRgbA(this.colorService.primaryColor);
        imageData.data[pos] = replacementColor.red;
        imageData.data[pos + 1] = replacementColor.green;
        imageData.data[pos + 2] = replacementColor.blue;
        // tslint:disable-next-line:no-magic-numbers
        imageData.data[pos + 3] = replacementColor.alpha;
    }

    toleranceToRGBA(): number {
        // 255 is the maximum number for a single r, g, b or a
        // tslint:disable-next-line:no-magic-numbers
        if (this.tolerance === 0) return 0;
        if (this.tolerance === 100) return 255;
        return (this.tolerance / MAX_TOLERANCE) * 255;
    }

    onMouseDown(event: MouseEvent): void {
        // Only near pixels with similar looking colors are painted. For example, a bounded domain is the only place where the paint will be.
        // Outside of the domain, the paint is not there.
        if (event.button === MouseButton.Left) {
            this.mouseDown = false;
            this.floodFill(event.offsetX, event.offsetY, this.hexToRgbA(this.colorService.primaryColor));
            return;
        }
        // The entire canvas is being verified if the target color plus tolerance can be colored with the replacement color.
        if (event.button === MouseButton.Right) {
            this.mouseDown = false;
            this.fill(event.offsetX, event.offsetY, this.hexToRgbA(this.colorService.primaryColor));
            return;
        }
    }

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseOut = true;
        }
    }
}
