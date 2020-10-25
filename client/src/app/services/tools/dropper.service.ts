import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DropperService extends Tool {
    rgba: RGBA;
    currentPosition: Vec2;
    private circleWidth: number;
    private circleHeight: number;
    private circlePositionX: number;
    private circlePositionY: number;
    private circleRadius: number = 18;
    private angleBegin: number = 0;
    private endAngle: number = 2 * Math.PI;
    private currentColor: string;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        if (event.button === MouseButton.Left) {
            this.mouseDown = false;
            const position = { x: event.offsetX, y: event.offsetY };
            this.rgba = this.colorService.getColor(position, this.drawingService.baseCtx);
            this.colorService.primaryColor = this.colorService.numeralToHex(this.rgba);
            this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
            this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor;
        }
        if (event.button === MouseButton.Right) {
            this.mouseDown = false;
            const position = { x: event.offsetX, y: event.offsetY };
            this.rgba = this.colorService.getColor(position, this.drawingService.baseCtx);
            this.colorService.secondaryColor = this.colorService.numeralToHex(this.rgba);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.circleWidth = this.drawingService.dropperCtx.canvas.offsetWidth / 2; // magic number needed to center cursor
        this.circleHeight = this.drawingService.dropperCtx.canvas.offsetHeight / 2;
        this.drawingService.dropperCtx.canvas.style.left = event.offsetX - this.circleWidth + 'px';
        this.drawingService.dropperCtx.canvas.style.top = event.offsetY - this.circleHeight + 'px';
        const position = { x: event.offsetX, y: event.offsetY };
        this.currentColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.drawingService.baseCtx));
        this.shapeCircle(this.currentColor);
    }
    shapeCircle(color: string): void {
        this.circlePositionX = this.circleWidth;
        this.circlePositionY = this.circleHeight;
        this.drawingService.dropperCtx.beginPath();
        this.drawingService.dropperCtx.arc(this.circlePositionX, this.circlePositionY, this.circleRadius, this.angleBegin, this.endAngle);
        this.drawingService.dropperCtx.fillStyle = color;
        this.drawingService.dropperCtx.fill();
        this.drawingService.dropperCtx.stroke();
    }

    onMouseOut(event: MouseEvent): void {
        this.drawingService.dropperCtx.canvas.style.display = 'none';
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.dropperCtx.canvas.style.display = 'inline-block';
    }
}
