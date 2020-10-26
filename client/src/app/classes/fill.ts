import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Point2d } from './point2d';
import { Vec2 } from './vec2';

// https://www.youtube.com/watch?v=HRZG_vsB4ZE&ab_channel=AjayBadgujar

export class Fill {
    constructor(
        ctx: CanvasRenderingContext2D,
        point: Point2d,
        color: string,
        drawingService: DrawingService,
        colorService: ColorService,
        canvasResizerService: CanvasResizerService,
    ) {
        this.ctx = ctx;
        this.point = point;
        this.color = color;
        this.imageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.canvasResizerService.canvasSize.x,
            this.canvasResizerService.canvasSize.y,
        );
        const fillColor: number[] = this.hexToRgbA(color);
        console.log(fillColor);
        const targetColor: number[] = this.getPixel(point as Vec2, drawingService.baseCtx);
        console.log(targetColor);
    }

    ctx: CanvasRenderingContext2D;
    point: Point2d;
    color: string = '#000000';
    drawingService: DrawingService;
    colorService: ColorService;
    canvasResizerService: CanvasResizerService;
    imageData: ImageData;
    colorAttributs: number = 4;
    pixelPos: number = 1;
    radix: number = 16;
    // tslint:disable-next-line: no-any
    fillStack: any = [];
    // fillColor: string = this.hexToRgbA(color);
    // targetColor: number[] = this.getPixel(point as Vec2, drawingService.baseCtx);

    floodFill(point: Vec2, targetColor: number[], fillColor: number[]): void {
        if (this.colorMatch(targetColor, fillColor)) {
            alert('same color');
        }
        const currentColor = this.getPixel(point as Vec2, this.drawingService.baseCtx);
        if (this.colorMatch(currentColor, targetColor)) {
            this.setPixel(point, fillColor);
            this.fillStack.push([new Point2d(point.x + this.pixelPos, point.y)], targetColor, fillColor); // right side pixel
            this.fillStack.push([new Point2d(point.x - this.pixelPos, point.y)], targetColor, fillColor); // left side pixel
            this.fillStack.push([new Point2d(point.x, point.y + this.pixelPos)], targetColor, fillColor);
            this.fillStack.push([new Point2d(point.x, point.y - this.pixelPos)], targetColor, fillColor);
        }
    }

    getPixel(position: Vec2, ctx: CanvasRenderingContext2D): number[] {
        if (position.x < 0 || position.y < 0 || this.imageData.width > 0 || this.imageData.height > 0) {
            // return { red: this.imageData[-1], green: this.imageData[-1], blue: this.imageData[-1], alpha: 0 }; // impossible color
            // tslint:disable-next-line:no-magic-numbers
            return [-1, -1, -1, -1]; // impossible color
        } else {
            const offset = (position.y * this.imageData.width + position.x) * this.colorAttributs;
            return [
                this.imageData.data[offset + 0], // red
                this.imageData.data[offset + 1], // green
                this.imageData.data[offset + 2], // blue
                // tslint:disable-next-line:no-magic-numbers
                this.imageData.data[offset + 3], // alpha
            ];
        }
    }

    setPixel(point: Vec2, fillColor: number[]): void {
        const offset = (point.y * this.imageData.width + point.x) * this.colorAttributs;
        (this.imageData.data[offset + 0] = fillColor[0]), // red
            (this.imageData.data[offset + 1] = fillColor[1]), // green
            (this.imageData.data[offset + 2] = fillColor[2]), // blue
            // tslint:disable-next-line:no-magic-numbers
            (this.imageData.data[offset + 3] = fillColor[3]); // alpha
    }

    hexToRgbA(hex: string): number[] {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result !== null) {
            return [
                // tslint:disable-next-line:no-non-null-assertion
                parseInt(result![1], this.radix), // ! to assure that result is not null
                // tslint:disable-next-line:no-non-null-assertion
                parseInt(result![1], this.radix),
                // tslint:disable-next-line:no-non-null-assertion
                parseInt(result![1], this.radix),
                // tslint:disable-next-line:no-magic-numbers
                255,
            ];
        } else {
            throw new Error('null hex');
        }
    }

    fillForColor(): void {
        if (this.fillStack.length()) {
            const range = this.fillStack.length();
            for (let i = 0; i < range; i++) {
                this.floodFill(this.fillStack[0], this.fillStack[1], this.fillStack[2]);
            }
            this.fillStack.splice(0, range);
            this.fillForColor();
        } else {
            // tslint:disable-next-line: no-any
            this.drawingService.baseCtx.putImageData((this.imageData as any) as ImageData, 0, 0);
            this.fillStack = [];
        }
    }

    colorMatch(currentColor: number[], futurColor: number[]): boolean {
        return (
            currentColor[0] === futurColor[0] &&
            currentColor[1] === futurColor[1] &&
            // tslint:disable-next-line:no-magic-numbers
            currentColor[2] === futurColor[2] &&
            // tslint:disable-next-line:no-magic-numbers
            currentColor[3] === futurColor[3]
        );
    }
}
