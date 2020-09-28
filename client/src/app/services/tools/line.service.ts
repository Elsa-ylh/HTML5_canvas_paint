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
    private pathData: Vec2[] = [];
    private pointMouse: Vec2 = { x: 0, y: 0 };
    private shiftKeyDown: boolean = false;
    private pointShiftMemori: Vec2 = { x: 0, y: 0 };

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown && !this.shiftKeyDown) {
            this.mouseMove = true;
            this.pathData.push(this.getPositionFromMouse(event));
        } else if (this.mouseDown && this.shiftKeyDown) {
            this.pathData.push(this.pointMouse);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseMove && !this.shiftKeyDown) {
            this.pointShiftMemori = this.pointMouse = this.getPositionFromMouse(event);
            this.drawLine(this.drawingService.previewCtx, this.pathData, this.pointMouse);
        } else if (this.shiftKeyDown) {
            this.pointShiftMemori = this.getPositionFromMouse(event);
        }
    }

    OnShiftKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown && this.mouseMove) {
            this.shiftKeyDown = true;
            this.mouseMove = false;
            this.pointMouse = this.shiftDrawAngleLine(this.pathData, this.pointMouse);
            this.drawLine(this.drawingService.previewCtx, this.pathData, this.pointMouse);
        }
    }

    OnShiftKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown && this.shiftKeyDown) {
            this.mouseMove = true;
            this.shiftKeyDown = false;
            this.drawLine(this.drawingService.previewCtx, this.pathData, this.pointShiftMemori);
        }
    }

    private shiftDrawAngleLine(path: Vec2[], lastPoint: Vec2): Vec2 {
        // Attention le calcul est en rad  le 0 rad  point vers la droit de la page et +-Pi rad point vers le gauche de la page.
        let newPoint: Vec2;
        const leastone = -1;
        const denominator8 = 8;
        const denominator4 = 4;
        const numerator7 = 7;
        const numerator5 = 5;
        const numerator3 = 3;
        const firstPoint = path[path.length + leastone];
        const dx = lastPoint.x - firstPoint.x;
        const dy = lastPoint.y - firstPoint.y;
        const angleabs = Math.abs(Math.atan2(dy, dx));
        if (angleabs < Math.PI / denominator8 || angleabs > (Math.PI * numerator7) / denominator8) {
            newPoint = { x: lastPoint.x, y: firstPoint.y };
        } else if (angleabs >= Math.PI / denominator8 && angleabs <= (Math.PI * numerator3) / denominator8) {
            const axey: number = dy > 0 ? leastone : 1;
            const newY: number = Math.tan((Math.PI * numerator3) / denominator4) * dx * axey;
            newPoint = { x: lastPoint.x, y: firstPoint.y + newY };
        } else if (angleabs <= (Math.PI * numerator7) / denominator8 && angleabs >= (Math.PI * numerator5) / denominator8) {
            const axey: number = dy > 0 ? leastone : 1;
            const newY: number = Math.tan(Math.PI / denominator4) * dx * axey;
            newPoint = { x: lastPoint.x, y: firstPoint.y + newY };
        } else {
            newPoint = { x: firstPoint.x, y: lastPoint.y };
        }
        return newPoint;
    }

    onDoubleClick(event: MouseEvent): void {
        if (this.mergeFirstPoint(this.pathData)) {
            this.pathData[this.pathData.length - 1] = this.pathData[0];
        }
        this.finalDrawLine(this.drawingService.baseCtx, this.pathData);
        this.clearPath();
        this.clearEffectTool();
    }

    onKeyEscape(event: KeyboardEvent): void {
        if (this.mouseDown) {
            this.clearPath();
            this.clearEffectTool();
        }
    }

    onKeyBackSpace(event: KeyboardEvent): void {
        if (this.mouseDown && this.pathData.length > 1) {
            this.pathData.pop();
            this.drawLine(this.drawingService.previewCtx, this.pathData, this.pointMouse);
        }
    }
    private finalDrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.clearPreviewCtx();
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();

        if (this.subToolSelect === SubToolselected.tool2) this.drawPoin(ctx, path);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[], lastPoint: Vec2): void {
        this.clearPreviewCtx();
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
        this.clearPreviewCtx();
    }

    private clearPreviewCtx(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    private clearPath(): void {
        this.pathData = [];
        this.shiftKeyDown = false;
        this.mouseDown = this.mouseMove = false;
        this.pointMouse = { x: 0, y: 0 };
        this.shiftKeyDown = false;
        this.pointShiftMemori = { x: 0, y: 0 };
    }
}
