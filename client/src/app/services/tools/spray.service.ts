import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { ToolInfoSpray } from '@app/classes/tool-info-spray';
import { SprayAction } from '@app/classes/undo-redo/spray-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class SprayService extends Tool {
    constructor(drawingService: DrawingService, public colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    density: number = 40; // number of drop per second //
    private currentColor: string;
    position: Vec2;
    private time: number = 1000;
    private timer: ReturnType<typeof setInterval>;
    private minAngle: number = 0;
    private maxAngle: number = Math.PI * 2;
    private minLength: number = 0;
    zoneDiameter: number = 60; // diametre de la zone d'application //
    dropDiameter: number = 2; // drop diameter //
    private rotation: number = 0;
    private beginAngle: number = 0;
    private endAngle: number = 2 * Math.PI;
    private angle: number;
    private radius: number;

    generateRandomValue(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    onMouseUp(event: MouseEvent): void {
        clearInterval(this.timer);

        this.currentColor = this.colorService.primaryColor;
        // undo - redo
        const sprayAction = new SprayAction(
            this.density,
            this.currentColor,
            this.zoneDiameter,
            this.dropDiameter,
            this.angle,
            this.radius,
            this.position,
            this.drawingService,
            this,
        );
        this.undoRedoService.addUndo(sprayAction);
        this.undoRedoService.clearRedo();
        this.mouseDown = false;
    }

    transform(toolInfo: ToolInfoSpray): void {
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.fillStyle = toolInfo.color;
        this.density = toolInfo.density;
        this.zoneDiameter = toolInfo.zoneDiameter;
        this.dropDiameter = toolInfo.dropDiameter;
        this.angle = toolInfo.angle;
        this.radius = toolInfo.radius;
        this.position = toolInfo.position;

        for (let i = this.density; i--; ) {
            this.angle = this.generateRandomValue(this.minAngle, this.maxAngle);
            this.radius = this.generateRandomValue(this.minLength, this.zoneDiameter / 2); // the max interval is the diameter of the zone
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.ellipse(
                this.position.x + this.radius * Math.cos(this.angle), // the center of drop in x axis depends on random angle
                this.position.y + this.radius * Math.sin(this.angle), // the center of drop in y axis depends on random angle
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
        this.currentColor = this.colorService.primaryColor;
        this.position = { x: event.offsetX, y: event.offsetY };
        this.transform({
            density: this.density,
            color: this.currentColor,
            zoneDiameter: this.zoneDiameter,
            dropDiameter: this.dropDiameter,
            angle: this.angle,
            radius: this.radius,
            position: this.position,
        });
        const callback = () => {
            this.transform({
                density: this.density,
                color: this.currentColor,
                zoneDiameter: this.zoneDiameter,
                dropDiameter: this.dropDiameter,
                angle: this.angle,
                radius: this.radius,
                position: this.position,
            });
        };
        this.timer = setInterval(callback, this.time);
    }

    onMouseMove(event: MouseEvent): void {
        this.position = { x: event.offsetX, y: event.offsetY };
    }
}
