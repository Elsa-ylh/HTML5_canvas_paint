import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectBrushEnum } from '@app/classes/select-brush-enum';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingInformationsService } from '@app/services/drawing-info/drawing-informations.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
const motionDifference = 5; // le numbre va faire marcher le ThichBrush
@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    pixelThickness: number = 4;

    private lastPoint: Vec2;
    private pathData: Vec2[];
    private selectBrush: number;

    constructor(drawingService: DrawingService, public drawingInfos: DrawingInformationsService) {
        super(drawingService);
        this.clearPath();
        this.selectBrush = 1;
    }

    onMouseDown(event: MouseEvent): void {
        this.witchBrush(this.selectBrush);
        this.mouseDown = event.button === MouseButton.Right;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.lastPoint.x = event.x;
            this.lastPoint.y = event.y;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        switch (this.selectBrush) {
            case SelectBrushEnum.Brush:
                ctx.beginPath();
                for (const point of path) {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
                break;
            case SelectBrushEnum.ShadowBrush:
                ctx.beginPath();
                for (const point of path) {
                    ctx.lineTo(point.x, point.y);
                }
                break;
            case SelectBrushEnum.ThichBrush:
                for (const point of path) {
                    ctx.beginPath();
                    ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();

                    ctx.moveTo(this.lastPoint.x - motionDifference, this.lastPoint.y - motionDifference);
                    ctx.lineTo(point.x - motionDifference, point.y - motionDifference);
                    ctx.stroke();

                    this.lastPoint = point;
                }
                break;
            case SelectBrushEnum.FurBrush:
                break;
            case SelectBrushEnum.RadiusBrush:
                break;
            default:
                break;
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private witchBrush(select: number): void {
        this.selectBrush = select;
        switch (select) {
            case SelectBrushEnum.Brush:
                this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
                break;
            case SelectBrushEnum.ShadowBrush:
                this.drawingService.baseCtx.shadowColor = 'rgb(0, 0, 0)';
                this.drawingService.baseCtx.shadowBlur = this.drawingService.baseCtx.lineWidth + 2;
                break;
            case SelectBrushEnum.ThichBrush:
                this.drawingService.baseCtx.lineJoin = 'bevel';
                this.drawingService.baseCtx.lineCap = 'butt';
                break;
            case SelectBrushEnum.FurBrush:
                break;
            case SelectBrushEnum.RadiusBrush:
                break;
            default:
                break;
        }
    }
}
