import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    position: Vec2;
    private canvasWidth: number;
    private canvasHeight: number;
    private currentStamp: HTMLImageElement;

    canvasScale: number = 3;
    imageScale: number = 0.00001;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    centerCanvas(event: MouseEvent): void {
        this.canvasWidth = this.drawingService.cursorCtx.canvas.offsetWidth / 2;
        this.canvasHeight = this.drawingService.cursorCtx.canvas.offsetHeight / 2;
        this.drawingService.cursorCtx.canvas.style.left = event.offsetX - this.canvasWidth + 'px';
        this.drawingService.cursorCtx.canvas.style.top = event.offsetY - this.canvasHeight + 'px';
    }

    onMouseMove(event: MouseEvent): void {
        this.centerCanvas(event);
    }

    drawImage(): void {
        this.currentStamp = new Image();
        this.currentStamp.onload = () => {
            this.drawingService.cursorCtx.drawImage(this.currentStamp, 0, 0);
        };
        this.currentStamp.src = 'assets/square.cur';
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.width = this.drawingService.cursorCtx.canvas.width * this.canvasScale;
        this.drawingService.cursorCtx.canvas.height = this.drawingService.cursorCtx.canvas.height * this.canvasScale;
        console.log(this.drawingService.cursorCtx.canvas.width);
        console.log(this.drawingService.cursorCtx.canvas.height);

        console.log('stamp');
        this.currentStamp.width = this.currentStamp.width + this.imageScale;
        this.currentStamp.height = this.currentStamp.height + this.imageScale;
        console.log(this.currentStamp.width);
        console.log(this.currentStamp.width);

        this.drawingService.cursorCtx.scale(this.currentStamp.width, this.currentStamp.height);
        this.drawImage();
    }

    onMouseUp(event: MouseEvent): void {
        this.centerCanvas(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
        this.drawImage();
    }
}
