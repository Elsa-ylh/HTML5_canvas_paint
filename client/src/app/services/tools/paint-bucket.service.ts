import { Injectable } from '@angular/core';
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
        if (this.matchFillColor(originalColor, replacementColor)) return;

        while (pixelStack.length > 0) {
            const newPixel: Vec2 = pixelStack.shift() as Vec2;
            x = newPixel.x;
            y = newPixel.y;

            // console.log( x + ", " + y ) ;

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

    // clic droit : double for dans une nouvelle fonction fill
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

    onMouseDown(event: MouseEvent): void {
        // debugger;
        console.log('color string', this.colorService.primaryColor);
        console.log('color rgba', this.hexToRgbA(this.colorService.primaryColor));
        this.floodFill(event.offsetX, event.offsetY, this.hexToRgbA(this.colorService.primaryColor));
    }
}
