import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { FeatherAction } from '@app/classes/undo-redo/feather-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class FeatherService extends Tool {
    private pathData: Vec2[]; //
    private primaryColor: string;
    private previewWidth: number = 2;
    private previewHeight: number = 2;
    featherLength: number = 1;
    featherAngle: number = 0;

    cursorLineCtx: CanvasRenderingContext2D;

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
        this.previewWidth = this.drawingService.cursorCtx.canvas.offsetWidth / 2; // magic number needed to center cursor
        this.previewHeight = this.drawingService.cursorCtx.canvas.offsetHeight / 2;
        this.drawingService.cursorCtx.canvas.style.left = event.offsetX - this.previewWidth + 'px';
        this.drawingService.cursorCtx.canvas.style.top = event.offsetY - this.previewHeight + 'px';
        this.linePreview();

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

    onMouseOut(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'none';
        this.cursorLineCtx.canvas.style.display = 'none';
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
        this.cursorLineCtx.canvas.style.display = 'inline-block';
        this.drawingService.cursorCtx.clearRect(0, 0, 40, 40);
    }

    drawFeather(ctx: CanvasRenderingContext2D, path: Vec2[], color: string): void {
        this.drawingService.baseCtx.strokeStyle = color;
        ctx.beginPath();
        ctx.lineWidth = this.featherLength;
        const sizePx = ctx.lineWidth;
        ctx.lineWidth = sizePx;
        for (let index = 1; index <= sizePx; index += 1) {
            ctx.beginPath();
            for (const point of path) {
                ctx.lineTo(point.x, point.y + Math.sin((Math.PI * this.featherAngle) / 180) * sizePx);
            }
            ctx.stroke();
        }
    }

    private linePreview(): void {
        this.drawingService.cursorCtx.beginPath();
        this.drawingService.cursorCtx.fillRect(0, 0, this.previewWidth, this.previewHeight);
        this.drawingService.cursorCtx.fillStyle = '#0000000';
        this.drawingService.cursorCtx.setTransform(1, 0, 0, 1, 0, 0);
    }

    clearPreviewCtx(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    clearPath(): void {
        this.pathData = [];
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.setLineDash([0, 0]);
        this.drawingService.previewCtx.setLineDash([0, 0]);
    }
}
