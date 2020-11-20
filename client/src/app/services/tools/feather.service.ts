import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { FeatherAction } from '@app/classes/undo-redo/feather-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
const motionDifference = 4;

@Injectable({
    providedIn: 'root',
})
export class FeatherService extends Tool {
    private pathData: Vec2[]; //
    private lineWidth = 2;
    private primaryColor: string;
    // private mouseOut: boolean = false;

    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }
    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);

        if (this.mouseDown) {
            this.clearPreviewCtx();
            this.pathData.push(mousePosition);
            this.primaryColor = this.colorService.primaryColor;
            this.drawFeather(this.drawingService.baseCtx, this.pathData, this.primaryColor);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);
            this.primaryColor = this.colorService.primaryColor;
            this.drawFeather(this.drawingService.baseCtx, this.pathData, this.primaryColor);
        }
        this.mouseDown = false;
        // undo- redo
        const featherAction = new FeatherAction(this.pathData, this.primaryColor, this.drawingService, this);
        this.undoRedoService.addUndo(featherAction);
        this.undoRedoService.clearRedo();

        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    drawFeather(ctx: CanvasRenderingContext2D, path: Vec2[], color: string): void {
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';
        this.drawingService.baseCtx.strokeStyle = color;
        ctx.lineWidth = this.lineWidth; // 2px
        ctx.beginPath();
        const sizePx = this.lineWidth;
        ctx.lineWidth = sizePx / motionDifference;
        for (let index = 1; index <= sizePx; index += 1) {
            ctx.beginPath();
            for (const point of path) {
                ctx.lineTo(point.x, point.y + sizePx - index);
            }
            ctx.stroke();
        }
        ctx.lineWidth = sizePx;
    }

    clearPreviewCtx(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    clearPath(): void {
        this.pathData = [];
        // this.mouseOut = false;
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.setLineDash([0, 0]);
        this.drawingService.previewCtx.setLineDash([0, 0]);
    }
}
