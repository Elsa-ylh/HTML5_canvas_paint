import { Injectable } from '@angular/core';
import { MouseButton, Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Right;
        if (this.mouseDown) {
            this.drawingService.baseCtx.strokeStyle = '#000000'; //to draw after erasing
            this.drawingService.previewCtx.strokeStyle = '#000000';
            this.drawingService.baseCtx.lineWidth = 2; // conserve same size a before
            this.drawingService.previewCtx.lineWidth = 2;
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            //  console.log('crayon');
        }
    }
    sizeSmale(): void {
        this.drawingService.baseCtx.lineWidth = 4;
        this.drawingService.previewCtx.lineWidth = 4;
    }
    sizeMedime(): void {
        this.drawingService.baseCtx.lineWidth = 8;
        this.drawingService.previewCtx.lineWidth = 8;
    }
    sizeBig(): void {
        this.drawingService.baseCtx.lineWidth = 12;
        this.drawingService.previewCtx.lineWidth = 12;
    }
    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
