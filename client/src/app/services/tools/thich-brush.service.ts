import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
//inpiration du site http://perfectionkills.com/exploring-canvas-drawing-techniques/ pour Thick brush
export enum MouseButton {
    Left = 2,
    Middle = 1,
    Right = 0,
    Back = 3,
    Forward = 4,
}
const startpx: number = 8; // on veut que le pinceau buissons épais au debut est une dimention de 8 px pour le diférencier du crayon
@Injectable({
    providedIn: 'root',
})
export class ThichBrushService extends Tool {
    private lastPoint: Vec2;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.initBrushService();
    }

    private initBrushService() {
        this.drawingService.baseCtx.lineJoin = 'bevel';
        this.drawingService.baseCtx.lineCap = 'butt';
        this.drawingService.baseCtx.lineWidth = startpx; // conserve same size a before
        this.drawingService.previewCtx.lineWidth = startpx;
    }

    //private

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Right;
        if (this.mouseDown) {
            this.lastPoint = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.baseCtx.lineTo(this.lastPoint.x, this.lastPoint.y);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.baseCtx.moveTo(this.lastPoint.x, this.lastPoint.y);
            this.drawingService.baseCtx.lineTo(event.clientX, event.clientY);
            this.drawingService.baseCtx.stroke();

            this.drawingService.baseCtx.moveTo(this.lastPoint.x - 5, this.lastPoint.y - 5);
            this.drawingService.baseCtx.lineTo(event.clientX - 5, event.clientY - 5);
            this.drawingService.baseCtx.stroke();
        }
    }
}
