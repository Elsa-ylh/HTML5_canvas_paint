import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers

@Injectable({
    providedIn: 'root',
})
export class SprayService extends Tool {
    constructor(drawingService: DrawingService, public colorService: ColorService) {
        super(drawingService);
    }

    private density: number = 40;
    private clicked: boolean = false;
    private currentColor: string;

    generateRandomValue(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    onMouseUp(event: MouseEvent): void {
        this.clicked = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.clicked === true) {
            this.transform(event);
        }
    }

    transform(event: MouseEvent): void {
        this.currentColor = this.colorService.primaryColor;
        this.drawingService.baseCtx.fillStyle = this.currentColor;
        for (let i = this.density; i--; ) {
            const angle = this.generateRandomValue(0, Math.PI * 2);
            const radius = this.generateRandomValue(0, 30);
            this.drawingService.baseCtx.globalAlpha = Math.random();
            this.drawingService.baseCtx.fillRect(
                event.offsetX + radius * Math.cos(angle),
                event.offsetY + radius * Math.sin(angle),
                this.generateRandomValue(1, 2),
                this.generateRandomValue(1, 2),
            );
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.clicked = true;
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.transform(event);
    }
}
