import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
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
    private currentColor: string;
    position: Vec2;
    private time: number;

    generateRandomValue(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
    }

    loopTransform(time: number): void {
        const callback = () => {
            this.transform();
        };
        setTimeout(callback, time);
    }

    transform(): void {
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.currentColor = this.colorService.primaryColor;
        this.drawingService.baseCtx.fillStyle = this.currentColor;
        for (let i = this.density; i--; ) {
            const angle = this.generateRandomValue(0, Math.PI * 2);
            const radius = this.generateRandomValue(0, 30);
            this.drawingService.baseCtx.fillRect(
                this.position.x + radius * Math.cos(angle),
                this.position.y + radius * Math.sin(angle),
                this.generateRandomValue(1, 2),
                this.generateRandomValue(1, 2),
            );
        }
        if (this.mouseDown) {
            this.time = 50;
            this.loopTransform(this.time);
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.position = { x: event.offsetX, y: event.offsetY };
        this.transform();
    }

    onMouseMove(event: MouseEvent): void {
        this.position = { x: event.offsetX, y: event.offsetY };
        if (this.mouseDown) {
            this.time = 3000;
            this.loopTransform(this.time);
        }
    }
}
