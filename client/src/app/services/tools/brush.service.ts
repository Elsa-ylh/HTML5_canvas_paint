import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { PointArc } from '@app/classes/point-arc';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
const motionDifference = 4; // Cette constante fait fonctionner thickBrush
const citcle = Math.PI * 2;
@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    pixelMinBrush: number = 6;
    pixelThickness: number = 4;
    private lastPoint: Vec2;
    private pathData: Vec2[];
    private brush4Data: PointArc[];
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.whichBrush(this.subToolSelect);
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            if (this.subToolSelect === SubToolselected.tool4) {
                const point = new PointArc(this.mouseDownCoord, this.remdomInt(), Math.random());
                this.brush4Data.push(point);
            } else {
                this.pathData.push(this.mouseDownCoord);
                this.lastPoint = this.getPositionFromMouse(event);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.subToolSelect === SubToolselected.tool4) {
                const point = new PointArc(mousePosition, this.remdomInt(), Math.random());
                this.brush4Data.push(point);
                this.drawBrushTool4(this.drawingService.baseCtx, this.brush4Data);
            } else {
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.baseCtx, this.pathData);
            }
        }
        this.mouseDown = false;
        this.clearPath();
        this.clearEffectTool();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.subToolSelect === SubToolselected.tool4) {
                const point = new PointArc(mousePosition, this.remdomInt(), Math.random());
                this.brush4Data.push(point);
                this.drawBrushTool4(this.drawingService.previewCtx, this.brush4Data);
            } else {
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            }
        }
    }

    private drawBrushTool4(ctx: CanvasRenderingContext2D, path: PointArc[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.beginPath();
            ctx.globalAlpha = point.opacity;
            ctx.arc(point.vec2.x, point.vec2.y, point.radius, 0, citcle);
            ctx.fill();
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        switch (this.subToolSelect) {
            case SubToolselected.tool1:
                ctx.beginPath();
                for (const point of path) {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
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

                    ctx.moveTo(this.lastPoint.x - motionDifference, this.lastPoint.y - motionDifference);
                    ctx.lineTo(point.x - motionDifference, point.y - motionDifference);
                    ctx.stroke();

                    this.lastPoint = point;
                }
                break;
            case SubToolselected.tool4:
                window.alert("un problème au niveau du fonctionnement du pinceau 4 s'est produit");
                // son fonctionnement est dans la fonction drawBrushTool4
                break;
            case SubToolselected.tool5:
                this.drawLineBrush(ctx, path);
                break;
            default:
                break;
        }
    }
    private drawLineBrush(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const sizePx = ctx.lineWidth;
        ctx.lineWidth = sizePx / motionDifference; // on divise par quatre
        ctx.lineCap = 'round';
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

    private whichBrush(select: number): void {
        this.clearEffectTool();
        switch (select) {
            case SubToolselected.tool1:
                this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
                this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';
                break;
            case SubToolselected.tool2:
                this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
                this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';
                this.drawingService.baseCtx.shadowColor = 'rgb(0, 0, 0)';
                this.drawingService.previewCtx.shadowColor = 'rgb(0, 0, 0)';
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
            default:
                break;
        }
    }

    private clearPath(): void {
        this.pathData = [];
        this.brush4Data = [];
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
    }
    private remdomInt(): number {
        const min = this.drawingService.baseCtx.lineWidth / motionDifference; // le cercle vont avoir une grande entre le rayon et son quarte
        const differnve = this.drawingService.baseCtx.lineWidth - min;
        return Math.floor(Math.random() * differnve) + min;
    }
}
