import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    position: Vec2;
    canvasWidth: number;
    canvasHeight: number;
    currentStamp = new Image();

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    centerCanvas(event: MouseEvent): void {
        this.canvasWidth = this.drawingService.stampCtx.canvas.offsetWidth / 2;
        this.canvasHeight = this.drawingService.stampCtx.canvas.offsetHeight / 2;
        this.drawingService.stampCtx.canvas.style.left = event.offsetX - this.canvasWidth + 'px';
        this.drawingService.stampCtx.canvas.style.top = event.offsetY - this.canvasHeight + 'px';
    }

    onMouseMove(event: MouseEvent): void {
        this.centerCanvas(event);
    }

    drawImage(): void {
        this.currentStamp.onload = () => {
            this.drawingService.stampCtx.drawImage(this.currentStamp, 0, 0);
        };
        this.currentStamp.src = 'assets/square.cur';
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.stampCtx.canvas.width = this.drawingService.stampCtx.canvas.width * 3;
        this.drawingService.stampCtx.canvas.height = this.drawingService.stampCtx.canvas.height * 3;
        console.log(this.drawingService.stampCtx.canvas.width);
        console.log(this.drawingService.stampCtx.canvas.height);

        console.log('stamp');
        this.currentStamp.width = this.currentStamp.width + 0.0002;
        this.currentStamp.height = this.currentStamp.height + 0.0002;
        console.log(this.currentStamp.width);
        console.log(this.currentStamp.width);

        this.drawingService.stampCtx.scale(this.currentStamp.width, this.currentStamp.height);
        this.drawImage();
    }

    onMouseUp(event: MouseEvent): void {
        this.centerCanvas(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawImage();
    }
}
