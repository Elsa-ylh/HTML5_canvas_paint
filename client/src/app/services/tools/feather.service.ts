import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { ToolInfoFeather } from '@app/classes/tool-info-feather';
import { FeatherAction } from '@app/classes/undo-redo/feather-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

export const FIFTEEN = 15;
export const ONE = 1;

@Injectable({
    providedIn: 'root',
})
export class FeatherService extends Tool {
    private thickness: number = 2;
    private pathData: Vec2[];
    private primaryColor: string;
    featherLength: number = 10;
    featherAngle: number = 0;
    altPressed: boolean = false;

    cursorLineCtx: CanvasRenderingContext2D;

    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.primaryColor = this.colorService.primaryColor;
        }
        this.clearEffectTool();
    }

    onMouseMove(event: MouseEvent): void {
        this.renderCursor(event);

        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.clearPreviewCtx();
            this.primaryColor = this.colorService.primaryColor;
            this.pathData.push(mousePosition);
            this.drawFeather(this.drawingService.baseCtx, this.pathData, {
                primaryColor: this.primaryColor,
                angle: this.featherAngle,
                length: this.featherLength,
            });
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(mousePosition);
            this.drawFeather(this.drawingService.baseCtx, this.pathData, {
                primaryColor: this.primaryColor,
                angle: this.featherAngle,
                length: this.featherLength,
            });
            this.primaryColor = this.colorService.primaryColor;
        }
        this.mouseDown = false;
        // undo - redo
        const featherAction = new FeatherAction(this.pathData, this.featherAngle, this.featherLength, this.primaryColor, this.drawingService, this);
        this.undoRedoService.addUndo(featherAction);
        this.undoRedoService.clearRedo();

        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseOut(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'none';
        this.drawingService.cursorCtx.canvas.style.display = 'none';
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
        this.drawingService.cursorCtx.canvas.style.display = 'inline-block';
    }

    drawFeather(ctx: CanvasRenderingContext2D, path: Vec2[], toolInfo: ToolInfoFeather): void {
        this.drawingService.baseCtx.strokeStyle = toolInfo.primaryColor;
        this.drawingService.baseCtx.lineJoin = 'bevel';
        ctx.lineWidth = this.thickness;
        this.featherLength = toolInfo.length;
        this.featherAngle = toolInfo.angle;
        const angleX = Math.cos((this.featherAngle * Math.PI) / 180);
        const angleY = Math.sin((this.featherAngle * Math.PI) / 180);

        ctx.beginPath();

        for (let line = 1; line < path.length; ++line) {
            for (let i = 0; i < this.featherLength; ++i) {
                ctx.moveTo(path[line - 1].x + angleX * i, path[line - 1].y + angleY * i);
                ctx.lineTo(path[line].x + angleX * i, path[line].y + angleY * i);
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

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

    // to scroll
    changeAngleWithScroll(event: WheelEvent): void {
        if (event.deltaX > 0) {
            if (!this.altPressed) {
                this.featherAngle += FIFTEEN;
            } else {
                this.featherAngle += ONE;
            }
        } else {
            if (!this.altPressed) {
                this.featherAngle -= FIFTEEN;
            } else {
                this.featherAngle -= ONE;
            }
        }
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
