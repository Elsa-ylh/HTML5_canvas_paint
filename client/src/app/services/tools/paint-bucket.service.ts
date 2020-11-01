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
    flood_fill(x: number, y: number, replacementColor: RGBA): void {
        const pixel_stack: Vec2[] = [];
        pixel_stack.push({ x: x, y: y });
        const pixels = this.drawingService.baseCtx.getImageData(0, 0, this.cvsResizerService.canvasSize.x, this.cvsResizerService.canvasSize.y);
        let linear_cords = (y * this.cvsResizerService.canvasSize.x + x) * 4;
        const original_color = {
            red: pixels.data[linear_cords],
            green: pixels.data[linear_cords + 1],
            blue: pixels.data[linear_cords + 2],
            alpha: pixels.data[linear_cords + 3],
        };

        while (pixel_stack.length > 0) {
            const new_pixel = pixel_stack.shift() as Vec2;
            x = new_pixel.x;
            y = new_pixel.y;

            //console.log( x + ", " + y ) ;

            linear_cords = (y * this.cvsResizerService.canvasSize.x + x) * 4;
            while (
                y-- >= 0 &&
                pixels.data[linear_cords] == original_color.red &&
                pixels.data[linear_cords + 1] == original_color.green &&
                pixels.data[linear_cords + 2] == original_color.blue &&
                pixels.data[linear_cords + 3] == original_color.alpha
            ) {
                linear_cords -= this.cvsResizerService.canvasSize.x * 4;
            }
            linear_cords += this.cvsResizerService.canvasSize.x * 4;
            y++;

            let reached_left = false;
            let reached_right = false;
            while (
                y++ < this.cvsResizerService.canvasSize.y &&
                pixels.data[linear_cords] == original_color.red &&
                pixels.data[linear_cords + 1] == original_color.green &&
                pixels.data[linear_cords + 2] == original_color.blue &&
                pixels.data[linear_cords + 3] == original_color.alpha
            ) {
                pixels.data[linear_cords] = replacementColor.red;
                pixels.data[linear_cords + 1] = replacementColor.green;
                pixels.data[linear_cords + 2] = replacementColor.blue;
                pixels.data[linear_cords + 3] = replacementColor.alpha;

                if (x > 0) {
                    if (
                        pixels.data[linear_cords - 4] == original_color.red &&
                        pixels.data[linear_cords - 4 + 1] == original_color.green &&
                        pixels.data[linear_cords - 4 + 2] == original_color.blue &&
                        pixels.data[linear_cords - 4 + 3] == original_color.alpha
                    ) {
                        if (!reached_left) {
                            pixel_stack.push({ x: x - 1, y: y });
                            reached_left = true;
                        }
                    } else if (reached_left) {
                        reached_left = false;
                    }
                }

                if (x < this.cvsResizerService.canvasSize.x - 1) {
                    if (
                        pixels.data[linear_cords + 4] == original_color.red &&
                        pixels.data[linear_cords + 4 + 1] == original_color.green &&
                        pixels.data[linear_cords + 4 + 2] == original_color.blue &&
                        pixels.data[linear_cords + 4 + 3] == original_color.alpha
                    ) {
                        if (!reached_right) {
                            pixel_stack.push({ x: x + 1, y: y });
                            reached_right = true;
                        }
                    } else if (reached_right) {
                        reached_right = false;
                    }
                }

                linear_cords += this.cvsResizerService.canvasSize.x * 4;
            }
        }
        this.drawingService.baseCtx.putImageData(pixels, 0, 0);
    }

    onMouseDown(event: MouseEvent): void {
        debugger;
        this.flood_fill(event.offsetX, event.offsetY, { red: 100, green: 100, blue: 100, alpha: 255 });
    }
}
