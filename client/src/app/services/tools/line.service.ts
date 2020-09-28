import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    pathData: Vec2[] = [];
    private pointMouse: Vec2;
    private shiftKeyDown: boolean = false;
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown && !this.shiftKeyDown) {
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
            this.shiftKeyDown = true;
            this.mouseMove = false;
            this.shiftDrawLine(this.drawingService.previewCtx, this.pathData, this.pointMouse);
        }
    }

    OnShiftKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            this.mouseMove = true;
            this.shiftKeyDown = false;
        }
    }

    private shiftDrawLine(ctx: CanvasRenderingContext2D, path: Vec2[], lastPoint: Vec2): void {
        // Attention le calcul est en rad
        const firstPoint = path[path.length - 1];
        const dx = lastPoint.x - firstPoint.x;
        const dy = lastPoint.y - firstPoint.y;
        const angle = Math.atan2(dx, dy);
        console.log(angle);
        this.drawLine(ctx, path, lastPoint);
    }

    onDoubleClick(event: MouseEvent): void {
        this.mouseDown = this.mouseMove = false;
        if (this.mergeFirstPoint(this.pathData)) {
            this.pathData[this.pathData.length - 1] = this.pathData[0];
        }
        this.finalDrawLine(this.drawingService.baseCtx, this.pathData);
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
        if (this.mouseDown && this.pathData.length > 1) {
            this.pathData.pop();
            this.drawLine(this.drawingService.previewCtx, this.pathData, this.pointMouse);
        }
    }
    private finalDrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();

        if (this.subToolSelect === SubToolselected.tool2) this.drawPoin(ctx, path);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[], lastPoint: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'bevel';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(lastPoint.x, lastPoint.y);
        ctx.stroke();
        if (this.subToolSelect === SubToolselected.tool2) this.drawPoin(ctx, path);
    }

    private drawPoin(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineJoin = ctx.lineCap = 'round';
        const sizePx = ctx.lineWidth;
        ctx.lineWidth = this.secondeSizePixel;
        for (const point of path) {
            ctx.beginPath();
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
        ctx.lineWidth = sizePx;
    }

    private mergeFirstPoint(path: Vec2[]): boolean {
        const maximumDistance = 20;
        const firstPoint = path[0];
        const lastPoint = path[path.length - 1];
        const dx = Math.abs(lastPoint.x - firstPoint.x);
        const dy = Math.abs(lastPoint.y - firstPoint.y);
        return dx <= maximumDistance && dy <= maximumDistance;
    }

    private clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = '#000000'; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = '#000000';
        this.drawingService.baseCtx.lineJoin = 'bevel';
        this.drawingService.baseCtx.lineCap = 'butt';
        this.drawingService.previewCtx.lineJoin = 'bevel';
        this.drawingService.previewCtx.lineCap = 'butt';
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
