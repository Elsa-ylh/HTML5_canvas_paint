import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    pathData: Vec2[] = [];
    private pointMouse: Vec2;
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }
    onMouseUp(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseMove = true;
            this.pathData.push(this.getPositionFromMouse(event));
        }
    }
    onMouseMove(event: MouseEvent): void {
        if (this.mouseMove) {
            this.pointMouse = this.getPositionFromMouse(event);
            this.drawLine(this.drawingService.previewCtx, this.pathData, this.pointMouse);
        }
    }
    OnShiftKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown && this.mouseMove) {
            this.mouseMove = false;
        }
    }

    OnShiftKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            this.mouseMove = true;
        }
    }

    onDoubleClick(event: MouseEvent): void {
        this.mouseDown = this.mouseMove = false;
        this.clearPath();
        this.clearEffectTool();
    }

    onKeyEscape(event: KeyboardEvent): void {
        if (this.mouseDown) {
            for (let index = this.pathData.length; 1 < index; index--) {
                this.pathData.pop();
            }
            this.drawLine(this.drawingService.previewCtx, this.pathData, this.pointMouse);
        }
    }

    onKeyBackSpace(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (this.mouseDown && this.pathData.length > 1) {
                this.pathData.pop();
                this.drawLine(this.drawingService.previewCtx, this.pathData, this.pointMouse);
            }
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[], lastPoint: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(lastPoint.x, lastPoint.y);
        ctx.stroke();
    }

    private clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = '#000000'; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = '#000000';
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.setLineDash([0, 0]); // reset
        this.drawingService.previewCtx.setLineDash([0, 0]);
        this.drawingService.baseCtx.globalAlpha = 1;
        this.drawingService.previewCtx.globalAlpha = 1;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
    private clearPath(): void {
        this.pathData = [];
    }
}
