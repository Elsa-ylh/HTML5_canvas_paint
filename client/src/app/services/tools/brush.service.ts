import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { ColorBrush, PointArc } from '@app/classes/point-arc';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { BrushAction } from '@app/classes/undo-redo/brush-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

const motionDifference = 4;
const citcle = Math.PI * 2;
@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    pixelMinBrush: number = 6;
    lineWidth: number = this.pixelMinBrush; //
    pixelThickness: number = 4; //
    private lastPoint: Vec2;
    private pathData: Vec2[]; //
    private brush4Data: PointArc[]; //
    private mouseOut: boolean = false;
    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.switchBrush(this.subToolSelect, this.lineWidth, {
            primaryColor: this.colorService.primaryColor,
            secondaryColor: this.colorService.secondaryColor,
        });
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            if (this.subToolSelect === SubToolselected.tool4) {
                const point = new PointArc(this.mouseDownCoord, this.randomInt(), Math.random());
                this.brush4Data.push(point);
            } else {
                this.pathData.push(this.mouseDownCoord);
                this.lastPoint = this.mouseDownCoord;
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.subToolSelect === SubToolselected.tool4) {
                const point = new PointArc(mousePosition, this.randomInt(), Math.random());
                this.brush4Data.push(point);
                this.drawBrushTool4(this.drawingService.baseCtx, this.brush4Data);
            } else {
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.baseCtx, this.pathData, this.subToolSelect);
            }
        }
        // undo-redo
        const primaryColorBrush = this.colorService.primaryColor;
        const secondaryColorBrush = this.colorService.secondaryColor;
        const brushAction = new BrushAction(
            this.pathData,
            this.brush4Data,
            primaryColorBrush,
            secondaryColorBrush,
            this.lineWidth,
            this.subToolSelect,
            this,
            this.drawingService,
        );
        this.undoRedoService.addUndo(brushAction);
        this.undoRedoService.clearRedo();
        this.mouseDown = false;
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown && !this.mouseOut) {
            this.clearPreviewCtx();
            if (this.subToolSelect === SubToolselected.tool4) {
                const point = new PointArc(mousePosition, this.randomInt(), Math.random());
                this.brush4Data.push(point);
                this.drawBrushTool4(this.drawingService.previewCtx, this.brush4Data);
            } else {
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.previewCtx, this.pathData, this.subToolSelect);
            }
        } else if (this.mouseOut) {
            this.lastPoint = mousePosition;
        }
    }
    onMouseOut(event: MouseEvent): void {
        this.mouseOut = true;
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.subToolSelect === SubToolselected.tool4) {
                const point = new PointArc(mousePosition, this.randomInt(), Math.random());
                this.brush4Data.push(point);
                this.drawBrushTool4(this.drawingService.baseCtx, this.brush4Data);
            } else {
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.baseCtx, this.pathData, this.subToolSelect);
            }
            this.clearPath();
            this.clearPreviewCtx();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown && this.mouseOut) {
            this.mouseDownCoord = this.lastPoint;
            if (this.subToolSelect === SubToolselected.tool4) {
                const point = new PointArc(this.mouseDownCoord, this.randomInt(), Math.random());
                this.brush4Data.push(point);
            } else {
                this.pathData.push(this.mouseDownCoord);
                this.lastPoint = this.mouseDownCoord;
            }
        }
        this.mouseOut = false;
    }

    drawBrushTool4(ctx: CanvasRenderingContext2D, path: PointArc[]): void {
        const tempAlpha = ctx.globalAlpha;
        for (const point of path) {
            ctx.beginPath();
            ctx.globalAlpha = point.opacity;
            ctx.arc(point.vec2.x, point.vec2.y, point.radius, 0, citcle);
            ctx.fill();
            ctx.stroke();
        }
        ctx.globalAlpha = tempAlpha;
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[], subBrushTool: SubToolselected): void {
        switch (subBrushTool) {
            case SubToolselected.tool1:
                this.drawLinePattern(ctx, path);
                break;
            case SubToolselected.tool2:
                ctx.beginPath();
                for (const point of path) {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
                break;
            case SubToolselected.tool3:
                ctx.beginPath();
                this.lastPoint = path[0];
                for (const point of path) {
                    ctx.beginPath();
                    if (this.lastPoint.x === point.x && point.y === this.lastPoint.y) {
                        ctx.moveTo(this.lastPoint.x - 1, this.lastPoint.y - 1);
                    } else {
                        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
                    }
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(this.lastPoint.x - motionDifference, this.lastPoint.y - motionDifference);
                    ctx.lineTo(point.x - motionDifference, point.y - motionDifference);
                    ctx.stroke();

                    this.lastPoint = point;
                }
                break;
            case SubToolselected.tool5:
                this.drawLineBrush5(ctx, path);
                break;
        }
    }
    drawLinePattern(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const px2 = 2;
        const dividerRadius = 3;
        const sizePx = ctx.lineWidth;
        const moveModify = sizePx / dividerRadius;

        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = px2;
        ctx.strokeStyle = this.colorService.secondaryColor;
        this.lastPoint = path[0];
        for (const point of path) {
            ctx.moveTo(this.lastPoint.x, this.lastPoint.y + moveModify);
            ctx.lineTo(this.lastPoint.x, this.lastPoint.y - moveModify);
            ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.moveTo(this.lastPoint.x, this.lastPoint.y + moveModify);
            ctx.lineTo(point.x, point.y);
            ctx.moveTo(this.lastPoint.x, this.lastPoint.y - moveModify);
            ctx.lineTo(point.x, point.y);
            this.lastPoint = point;
        }
        ctx.stroke();
        ctx.strokeStyle = this.colorService.primaryColor;
        ctx.lineWidth = sizePx;
    }

    private drawLineBrush5(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const sizePx = ctx.lineWidth;
        ctx.lineWidth = sizePx / motionDifference;
        for (let index = 1; index <= sizePx; index += 1) {
            ctx.beginPath();
            ctx.globalAlpha = index / sizePx;
            for (const point of path) {
                ctx.lineTo(point.x, point.y + sizePx - index);
            }
            ctx.stroke();
        }
        ctx.lineWidth = sizePx;
    }

    switchBrush(select: number, lineWidth: number, color: ColorBrush): void {
        this.drawingService.baseCtx.lineWidth = this.drawingService.previewCtx.lineWidth = lineWidth;
        this.colorService.primaryColor = color.primaryColor;
        this.colorService.secondaryColor = color.secondaryColor;
        this.clearEffectTool();
        switch (select) {
            case SubToolselected.tool1:
                this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
                this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';
                break;
            case SubToolselected.tool2:
                this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
                this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';
                this.drawingService.baseCtx.shadowColor = color.secondaryColor;
                this.drawingService.previewCtx.shadowColor = color.secondaryColor;
                this.drawingService.baseCtx.shadowBlur = this.drawingService.baseCtx.lineWidth;
                this.drawingService.previewCtx.shadowBlur = this.drawingService.baseCtx.lineWidth;
                break;
            case SubToolselected.tool3:
                this.drawingService.baseCtx.lineJoin = this.drawingService.previewCtx.lineJoin = 'bevel';
                this.drawingService.baseCtx.lineCap = this.drawingService.previewCtx.lineCap = 'butt';
                break;
            case SubToolselected.tool4:
                this.drawingService.baseCtx.lineCap = 'butt';
                this.drawingService.baseCtx.lineJoin = 'miter';
                this.drawingService.previewCtx.lineCap = 'butt';
                this.drawingService.previewCtx.lineJoin = 'miter';

                break;
            case SubToolselected.tool5:
                this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
                this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';
                break;
        }
    }
    clearPreviewCtx(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
    clearPath(): void {
        this.pathData = [];
        this.brush4Data = [];
        this.mouseOut = false;
    }
    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.setLineDash([0, 0]);
        this.drawingService.previewCtx.setLineDash([0, 0]);
    }
    private randomInt(): number {
        const min = this.drawingService.baseCtx.lineWidth / motionDifference;
        const difference = this.drawingService.baseCtx.lineWidth - min;
        return Math.floor(Math.random() * difference) + min;
    }
}
