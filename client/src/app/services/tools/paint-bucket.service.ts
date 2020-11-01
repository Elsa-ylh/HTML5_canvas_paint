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

    // if needed, put parameter as MouseEvent with only offsetX and offsetY to get that particular position color
    private getPosColor(pos: Vec2): RGBA {
        return {
            red: this.drawingService.baseCtx.getImageData(pos.x, pos.y, 1, 1).data[0],
            green: this.drawingService.baseCtx.getImageData(pos.x, pos.y, 1, 1).data[1],
            blue: this.drawingService.baseCtx.getImageData(pos.x, pos.y, 1, 1).data[2],
            alpha: this.drawingService.baseCtx.getImageData(pos.x, pos.y, 1, 1).data[3],
        } as RGBA;
    }

    private drawPosColor(pos: Vec2, rgba: RGBA): void {
        this.drawingService.baseCtx.fillRect(pos.x, pos.y, 1, 1);
    }

    private compareRGBA(first: RGBA, second: RGBA): boolean {
        if (first.red === second.red && first.green === second.green && first.blue === second.blue && first.alpha === second.alpha) {
            return true;
        }
        return false;
    }

    /*
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
    */

    // https://en.wikipedia.org/wiki/Flood_fill#:~:text=Flood%20fill%2C%20also%20called%20seed,in%20a%20multi%2Ddimensional%20array.
    private draw(pos: Vec2, rgba: RGBA): void {
        return;
    }

    onMouseDown(event: MouseEvent): void {
        const pixelColorToBucket = this.getPosColor(event);
        pixelColorToBucket.alpha = 255;
        pixelColorToBucket.red = 255;
        pixelColorToBucket.green = 255;
        pixelColorToBucket.blue = 255;

        this.drawingService.baseCtx.fillStyle = this.colorService.primaryColor;

        // We will do detection north, south, east and west. No need to do diagonal detection.
        // this.checkFourPolesAndDraw(event, this.white);
        this.draw({ x: event.offsetX, y: event.offsetY }, pixelColorToBucket);

        //console.log('bonsoir');
    }
}
