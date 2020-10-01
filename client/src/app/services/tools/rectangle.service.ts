import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    lineWidth: number = 1;
    fillColor: string = '#ffb366';
    strokeColor: string = '#00ccff';
    square: boolean = false;
    height: number;
    width: number;
    mousePosition: Vec2;
    distanceX: number;
    distanceY: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.drawingService.baseCtx.setLineDash([0, 0]); // reset
        this.drawingService.previewCtx.setLineDash([0, 0]); // reset
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.selectRectangle(mousePosition, true);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectRectangle(mousePosition, false);
        }
    }

    OnShiftKeyDown(event: KeyboardEvent): void {
        this.square = true;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectRectangle(this.mousePosition, false);
        }
    }

    OnShiftKeyUp(event: KeyboardEvent): void {
        this.square = false;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectRectangle(this.mousePosition, false);
        }
    }

    drawFillRectangle(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2, fillColor: string): void {
        this.distanceX = mouseUpPos.x - mouseDownPos.x;
        this.distanceY = mouseUpPos.y - mouseDownPos.y;
        this.height = Math.sign(this.distanceY) * Math.abs(Math.min(this.distanceX, this.distanceY));
        this.width = Math.sign(this.distanceX) * Math.abs(Math.min(this.distanceX, this.distanceY));
        ctx.fillStyle = fillColor;
        if (this.square) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }

    drawRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2, lineWidth: number, strokeColor: string): void {
        this.distanceX = mouseUpPos.x - mouseDownPos.x;
        this.distanceY = mouseUpPos.y - mouseDownPos.y;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        this.height = Math.sign(this.distanceY) * Math.abs(Math.min(this.distanceX, this.distanceY));
        this.width = Math.sign(this.distanceX) * Math.abs(Math.min(this.distanceX, this.distanceY));

        if (this.square) {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }

    drawFillRectangleOutline(
        ctx: CanvasRenderingContext2D,
        mouseDownPos: Vec2,
        mouseUpPos: Vec2,
        lineWidth: number,
        fillColor: string,
        strokeColor: string,
    ): void {
        this.distanceX = mouseUpPos.x - mouseDownPos.x;
        this.distanceY = mouseUpPos.y - mouseDownPos.y;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        this.height = Math.sign(this.distanceY) * Math.abs(Math.min(this.distanceX, this.distanceY));
        this.width = Math.sign(this.distanceX) * Math.abs(Math.min(this.distanceX, this.distanceY));
        if (this.square) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }
    clearPreviewCtx(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
    selectRectangle(mousePosition: Vec2, base: boolean): void {
        if (base) {
            switch (this.subToolSelect) {
                case SubToolselected.tool1: {
                    this.drawFillRectangle(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition, this.fillColor);
                    break;
                }

                case SubToolselected.tool2: {
                    this.drawRectangleOutline(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition, this.lineWidth, this.strokeColor);
                    break;
                }

                case SubToolselected.tool3: {
                    this.drawFillRectangleOutline(
                        this.drawingService.baseCtx,
                        this.mouseDownCoord,
                        mousePosition,
                        this.lineWidth,
                        this.fillColor,
                        this.strokeColor,
                    );
                    break;
                }
            }
        } else {
            switch (this.subToolSelect) {
                case SubToolselected.tool1:
                    this.drawFillRectangle(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition, this.fillColor);
                    break;

                case SubToolselected.tool2:
                    this.drawRectangleOutline(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition, this.lineWidth, this.strokeColor);
                    break;

                case SubToolselected.tool3:
                    this.drawFillRectangleOutline(
                        this.drawingService.previewCtx,
                        this.mouseDownCoord,
                        mousePosition,
                        this.lineWidth,
                        this.fillColor,
                        this.strokeColor,
                    );
                    break;
            }
        }
    }
}
