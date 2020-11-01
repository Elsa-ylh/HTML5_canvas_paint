import { Injectable } from '@angular/core';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    private readonly black: RGBA = { red: 0, green: 0, blue: 0, alpha: 255 } as RGBA;
    private readonly white: RGBA = { red: 255, green: 255, blue: 255, alpha: 255 } as RGBA;

    constructor(drawingService: DrawingService, private colorService: ColorService, private cvsResizerService: CanvasResizerService) {
        super(drawingService);
    }

    // if needed, put parameter as MouseEvent with only offsetX and offsetY to get that particular position color
    private getPosColor(event: MouseEvent): RGBA {
        return {
            red: this.drawingService.baseCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data[0],
            green: this.drawingService.baseCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data[1],
            blue: this.drawingService.baseCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data[2],
            alpha: this.drawingService.baseCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data[3],
        } as RGBA;
    }

    private drawPosColor(event: MouseEvent, rgba: RGBA): void {
        this.drawingService.baseCtx.rect(event.offsetX, event.offsetY, 1, 1);
        this.drawingService.baseCtx.fill();
    }

    private compareRGBA(first: RGBA, second: RGBA): boolean {
        if (first.red === second.red && first.green === second.green && first.blue === second.blue && first.alpha === second.alpha) {
            return true;
        }
        return false;
    }

    private checkFourPolesAndDraw(event: MouseEvent, rgba: RGBA): void {
        // check north
        let colorToCheck = this.getPosColor({ offsetX: event.offsetX, offsetY: event.offsetY - 1 } as MouseEvent);
        if (event.offsetY > 0 && this.compareRGBA(colorToCheck, rgba)) {
            this.drawPosColor({ offsetX: event.offsetX, offsetY: event.offsetY - 1 } as MouseEvent, rgba);

            const northEvent = { offsetX: event.offsetX, offsetY: event.offsetY - 1 } as MouseEvent;
            this.checkFourPolesAndDraw(northEvent, rgba);
        }
        // check south
        colorToCheck = this.getPosColor({ offsetX: event.offsetX, offsetY: event.offsetY + 1 } as MouseEvent);
        if (event.offsetY < this.cvsResizerService.canvasSize.y && this.compareRGBA(colorToCheck, rgba)) {
            this.drawPosColor({ offsetX: event.offsetX, offsetY: event.offsetY + 1 } as MouseEvent, rgba);

            const southEvent = { offsetX: event.offsetX, offsetY: event.offsetY + 1 } as MouseEvent;
            this.checkFourPolesAndDraw(southEvent, rgba);
        }
        // check left
        colorToCheck = this.getPosColor({ offsetX: event.offsetX - 1, offsetY: event.offsetY } as MouseEvent);
        if (event.offsetX > 0 && this.compareRGBA(colorToCheck, rgba)) {
            this.drawPosColor({ offsetX: event.offsetX - 1, offsetY: event.offsetY } as MouseEvent, rgba);

            const leftEvent = { offsetX: event.offsetX - 1, offsetY: event.offsetY } as MouseEvent;
            this.checkFourPolesAndDraw(leftEvent, rgba);
        }
        // check right
        colorToCheck = this.getPosColor({ offsetX: event.offsetX + 1, offsetY: event.offsetY } as MouseEvent);
        if (event.offsetX < this.cvsResizerService.canvasSize.x && this.compareRGBA(colorToCheck, rgba)) {
            this.drawPosColor({ offsetX: event.offsetX + 1, offsetY: event.offsetY } as MouseEvent, rgba);

            const rightEvent = { offsetX: event.offsetX + 1, offsetY: event.offsetY } as MouseEvent;
            this.checkFourPolesAndDraw(rightEvent, rgba);
        }
    }

    onMouseDown(event: MouseEvent): void {
        // const pixelColorToBucket = this.getPosColor(event);

        this.drawingService.baseCtx.fillStyle = this.colorService.primaryColor;

        // We will do detection north, south, east and west. No need to do diagonal detection.
        debugger;
        this.checkFourPolesAndDraw(event, this.white);

        console.log('bonsoir');
    }
}
