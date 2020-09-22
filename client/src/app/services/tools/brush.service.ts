import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    pixelThickness: number = 4;

    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.initBrushService();
    }

    private initBrushService() {
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.lineWidth = this.pixelThickness; // conserve same size a before
        this.drawingService.previewCtx.lineWidth = this.pixelThickness;
        this.drawingService.baseCtx.strokeStyle = '#000000'; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = '#000000';
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Right;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
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
