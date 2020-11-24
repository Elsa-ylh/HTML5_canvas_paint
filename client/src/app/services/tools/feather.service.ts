import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class FeatherService extends Tool {
    private readonly thickness: number = 2;

    private pathData: Vec2[];
    // private primaryColor: string;
    // private previewWidth: number = 2;
    // private previewHeight: number = 2;
    featherLength: number = 30;
    featherAngle: number = 120;

    cursorLineCtx: CanvasRenderingContext2D;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService, // private undoRedoService: UndoRedoService
    ) {
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
        this.renderCursor(event);

        /*
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.clearPreviewCtx();
            this.pathData.push(mousePosition);
            this.primaryColor = this.colorService.primaryColor;
            // this.drawFeather(this.drawingService.baseCtx, this.pathData, this.primaryColor);
        }
        */
    }

    /*
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
    */

    onMouseOut(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'none';
        this.drawingService.cursorCtx.canvas.style.display = 'none';
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
    }

    /*
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
    */

    private renderCursor(event: MouseEvent): void {
        const maxSize = this.drawingService.cursorCtxWidthAndHeight;

        this.drawingService.cursorCtx.canvas.style.left = event.offsetX - maxSize / 2 + 'px';
        this.drawingService.cursorCtx.canvas.style.top = event.offsetY - maxSize / 2 + 'px';

        this.drawingService.cursorCtx.clearRect(0, 0, maxSize, maxSize);
        this.drawingService.cursorCtx.beginPath();

        this.drawingService.cursorCtx.translate(maxSize / 2, maxSize / 2);
        this.drawingService.cursorCtx.rotate((this.featherAngle * Math.PI) / 180);
        this.drawingService.cursorCtx.translate(-maxSize / 2, -maxSize / 2);

        this.drawingService.cursorCtx.fillStyle = '#000000';
        this.drawingService.cursorCtx.fillRect(
            (maxSize - this.featherLength) / 2,
            (maxSize - this.thickness) / 2,
            this.featherLength,
            this.thickness,
        );

        this.drawingService.cursorCtx.stroke();

        this.drawingService.cursorCtx.resetTransform();
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
