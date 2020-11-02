import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

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
    tolerance: number;
    pixels: ImageData;

    // https://en.wikipedia.org/wiki/Flood_fill#:~:text=Flood%20fill%2C%20also%20called%20seed,in%20a%20multi%2Ddimensional%20array.
    // https://ben.akrin.com/?p=7888
    // https://ben.akrin.com/canvas_fill/fill_04.html

    /*tslint:disable:cyclomatic-complexity*/
    floodFill(pos: Vec2, replacementColor: RGBA, tolerance: number): void {
        this.pixels = this.drawingService.baseCtx.getImageData(0, 0, this.cvsResizerService.canvasSize.x, this.cvsResizerService.canvasSize.y);
        const pixelStack: Vec2[] = [];
        pixelStack.push(pos);

        // Maximum tolerance of 100, Default to 0
        // tslint:disable-next-line:no-magic-numbers
        tolerance = !isNaN(this.tolerance) ? Math.min(Math.abs(Math.round(this.tolerance)), 100) : 0;
        // console.log(tolerance);

        let linearCords: number = (pos.y * this.cvsResizerService.canvasSize.x + pos.x) * this.colorAttributs;
        const originalColor = {
            red: this.pixels.data[linearCords],
            green: this.pixels.data[linearCords + 1],
            blue: this.pixels.data[linearCords + 2],
            // tslint:disable-next-line:no-magic-numbers
            alpha: this.pixels.data[linearCords + 3],
        };

        // if current pixel matches clicked color
        if (this.matchFillColor(originalColor, replacementColor)) return;

        while (pixelStack.length > 0) {
            const newPixel: Vec2 = pixelStack.shift() as Vec2;
            pos.x = newPixel.x;
            pos.y = newPixel.y;

            // console.log( x + ", " + y ) ;

            linearCords = (pos.y * this.cvsResizerService.canvasSize.x + pos.x) * this.colorAttributs;
            while (
                pos.y-- >= 0 &&
                this.pixels.data[linearCords] === originalColor.red &&
                this.pixels.data[linearCords + 1] === originalColor.green &&
                this.pixels.data[linearCords + 2] === originalColor.blue &&
                // tslint:disable-next-line:no-magic-numbers
                this.pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                linearCords -= this.cvsResizerService.canvasSize.x * this.colorAttributs;
            }
            linearCords += this.cvsResizerService.canvasSize.x * this.colorAttributs;
            pos.y++;

            let reachedLeft = false;
            let reachedRight = false;
            while (
                pos.y++ < this.cvsResizerService.canvasSize.y &&
                this.pixels.data[linearCords] === originalColor.red &&
                this.pixels.data[linearCords + 1] === originalColor.green &&
                this.pixels.data[linearCords + 2] === originalColor.blue &&
                // tslint:disable-next-line:no-magic-numbers
                this.pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                this.pixels.data[linearCords] = replacementColor.red;
                this.pixels.data[linearCords + 1] = replacementColor.green;
                this.pixels.data[linearCords + 2] = replacementColor.blue;
                // tslint:disable-next-line:no-magic-numbers
                this.pixels.data[linearCords + 3] = replacementColor.alpha;

                if (pos.x > 0) {
                    if (
                        this.pixels.data[linearCords - this.colorAttributs] === originalColor.red &&
                        this.pixels.data[linearCords - this.colorAttributs + 1] === originalColor.green &&
                        this.pixels.data[linearCords - this.colorAttributs + 2] === originalColor.blue &&
                        // tslint:disable-next-line:no-magic-numbers
                        this.pixels.data[linearCords - this.colorAttributs + 3] === originalColor.alpha
                    ) {
                        if (!reachedLeft) {
                            pixelStack.push({ x: pos.x - 1, y: pos.y });
                            reachedLeft = true;
                        }
                    } else if (reachedLeft) {
                        reachedLeft = false;
                    }
                }

                if (pos.x < this.cvsResizerService.canvasSize.x - 1) {
                    if (
                        this.pixels.data[linearCords + this.colorAttributs] === originalColor.red &&
                        this.pixels.data[linearCords + this.colorAttributs + 1] === originalColor.green &&
                        this.pixels.data[linearCords + this.colorAttributs + 2] === originalColor.blue &&
                        // tslint:disable-next-line:no-magic-numbers
                        this.pixels.data[linearCords + this.colorAttributs + 3] === originalColor.alpha
                    ) {
                        if (!reachedRight) {
                            pixelStack.push({ x: pos.x + 1, y: pos.y });
                            reachedRight = true;
                        }
                    } else if (reachedRight) {
                        reachedRight = false;
                    }
                }

                linearCords += this.cvsResizerService.canvasSize.x * this.colorAttributs;
            }
        }
        this.drawingService.baseCtx.putImageData(this.pixels, 0, 0);
    }
    /*tslint:enable:cyclomatic-complexity*/

    // clic droit : double for dans une nouvelle fonction fill

    fill(pos: Vec2, replacementColor: RGBA, tolerance: number): void {
        this.pixels = this.drawingService.baseCtx.getImageData(0, 0, this.cvsResizerService.canvasSize.x, this.cvsResizerService.canvasSize.y);
        const linearCords: number = (pos.y * this.cvsResizerService.canvasSize.x + pos.x) * this.colorAttributs;

        for (let i = 0; i < this.cvsResizerService.canvasSize.x; i++) {
            for (let j = 0; j < this.cvsResizerService.canvasSize.y; j++) {
                this.pixels.data[linearCords] = replacementColor.red;
                this.pixels.data[linearCords + 1] = replacementColor.green;
                this.pixels.data[linearCords + 2] = replacementColor.blue;
                // tslint:disable-next-line:no-magic-numbers
                this.pixels.data[linearCords + 3] = replacementColor.alpha;
            }
        }
    }
    // tolerance : nombre entre 0 et 100 => 0 tolerance max et 100 tolerance minimale => fill tout
    // difference entre les couleurs : red, blue, green, alpha puis moyenne a comparer => convertir en %

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
        if (
            currentColor.red === targetColor.red &&
            currentColor.green === targetColor.green &&
            currentColor.blue === targetColor.blue &&
            currentColor.alpha === targetColor.alpha
        ) {
            return true;
        } else {
            return false;
        }
    }

    PixelCompareAndSet(pos: Vec2, targetColor: RGBA, fillColor: RGBA, tolerance: number): boolean {
        this.pixels = this.drawingService.baseCtx.getImageData(0, 0, this.cvsResizerService.canvasSize.x, this.cvsResizerService.canvasSize.y);
        const linearCords: number = (pos.y * this.cvsResizerService.canvasSize.x + pos.x) * this.colorAttributs;
        if (this.pixelCompare(pos, targetColor, fillColor, tolerance)) {
            this.pixels.data[linearCords] = fillColor.red;
            this.pixels.data[linearCords + 1] = fillColor.green;
            this.pixels.data[linearCords + 2] = fillColor.blue;
            // tslint:disable-next-line:no-magic-numbers
            this.pixels.data[linearCords + 3] = fillColor.alpha;
            return true;
        }
        return false;
    }

    pixelCompare(pos: Vec2, originalColor: RGBA, replacementColor: RGBA, tolerance: number): boolean {
        this.pixels = this.drawingService.baseCtx.getImageData(0, 0, this.cvsResizerService.canvasSize.x, this.cvsResizerService.canvasSize.y);
        const linearCords: number = (pos.y * this.cvsResizerService.canvasSize.x + pos.x) * this.colorAttributs;
        if (
            Math.abs(originalColor.alpha - replacementColor.alpha) <= this.tolerance &&
            Math.abs(originalColor.red - replacementColor.red) <= this.tolerance &&
            Math.abs(originalColor.green - replacementColor.green) <= this.tolerance &&
            Math.abs(originalColor.blue - replacementColor.blue) <= this.tolerance
        )
            return false; // target is same as fill

        if (
            // tslint:disable-next-line:no-magic-numbers
            originalColor.alpha === this.pixels.data[linearCords + 3] &&
            originalColor.red === this.pixels.data[linearCords] &&
            originalColor.green === this.pixels.data[linearCords + 1] &&
            originalColor.blue === this.pixels.data[linearCords + 2]
        )
            return true; // target matches surface

        if (
            // tslint:disable-next-line:no-magic-numbers
            Math.abs(originalColor.alpha - this.pixels.data[linearCords + 3]) <= 255 - this.tolerance &&
            Math.abs(originalColor.red - this.pixels.data[linearCords]) <= this.tolerance &&
            Math.abs(originalColor.green - this.pixels.data[linearCords + 1]) <= this.tolerance &&
            Math.abs(originalColor.blue - this.pixels.data[linearCords + 2]) <= this.tolerance
        )
            return true; // target to surface within tolerance

        return false; // no match
    }

    onMouseDown(event: MouseEvent): void {
        // pixels contigus
        if (event.button === MouseButton.Left) {
            this.mouseDown = false;
            this.floodFill({ x: event.offsetX, y: event.offsetY }, this.hexToRgbA(this.colorService.primaryColor), this.tolerance);
        }
        // pixels non contigus
        if (event.button === MouseButton.Right) {
            this.mouseDown = false;
            this.fill({ x: event.offsetX, y: event.offsetY }, this.hexToRgbA(this.colorService.primaryColor), this.tolerance);
        }
    }

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseOut = true;
        }
    }
}
