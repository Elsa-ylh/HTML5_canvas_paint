import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SprayService extends Tool {
    constructor(drawingService: DrawingService, public colorService: ColorService) {
        super(drawingService);
    }

    density: number = 40; // number of drop per second
    private currentColor: string;
    position: Vec2;
    private time: number = 1000;
    private timer: ReturnType<typeof setInterval>;
    private minAngle: number = 0;
    private maxAngle: number = Math.PI * 2;
    private minLength: number = 0;
    zoneDiameter: number = 60; // diametre de la zone d'application
    dropDiameter: number = 2; // drop diameter
    private rotation: number = 0;
    private beginAngle: number = 0;
    private endAngle: number = 2 * Math.PI;

    generateRandomValue(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    onMouseUp(event: MouseEvent): void {
        clearInterval(this.timer);
        this.mouseDown = false;
    }

    transform(): void {
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.currentColor = this.colorService.primaryColor;
        this.drawingService.baseCtx.fillStyle = this.currentColor;
        for (let i = this.density; i--; ) {
            const angle = this.generateRandomValue(this.minAngle, this.maxAngle);
            const radius = this.generateRandomValue(this.minLength, this.zoneDiameter / 2); // the max interval is the diameter of the zone
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.ellipse(
                this.position.x + radius * Math.cos(angle), // the center of drop in x axis depends on random angle
                this.position.y + radius * Math.sin(angle), // the center of drop in y axis depends on random angle
                this.dropDiameter / 2,
                this.dropDiameter / 2,
                this.rotation,
                this.beginAngle,
                this.endAngle,
            );
            this.drawingService.baseCtx.fill();
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.position = { x: event.offsetX, y: event.offsetY };
        this.transform();
        const callback = () => {
            this.transform();
        };
        this.timer = setInterval(callback, this.time);
    }

    onMouseMove(event: MouseEvent): void {
        this.position = { x: event.offsetX, y: event.offsetY };
    }
}
