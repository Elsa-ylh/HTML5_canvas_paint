import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    lineWidth: number = 1;
    fillColor: string;
    strokeColor: string;
    square: boolean = false;
    height: number;
    width: number;
    mousePosition: Vec2;
    distanceX: number;
    distanceY: number;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.clearEffectTool();
        this.strokeColor = this.colorService.primaryColor;
        this.fillColor = this.colorService.secondaryColor;
        if (this.mouseEnter) {
            this.onMouseUp(event);
        }
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
        this.mousePosition = this.mouseDownCoord;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.selectRectangle(mousePosition, true);
        }
        this.mouseDown = false;
        this.mouseEnter = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectRectangle(mousePosition, false);
        }
    }

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseOut = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseOut) {
            this.mouseEnter = true;
        }
        this.mouseOut = false;
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

    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = '#000000'; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = '#000000';
        this.drawingService.baseCtx.lineJoin = 'miter';
        this.drawingService.baseCtx.lineCap = 'square';
        this.drawingService.previewCtx.lineJoin = 'miter';
        this.drawingService.previewCtx.lineCap = 'square';
        this.drawingService.baseCtx.setLineDash([0, 0]); // reset
        this.drawingService.previewCtx.setLineDash([0, 0]);
    }

    drawFillRectangle(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        ctx.fillStyle = this.colorService.secondaryColor;

        if (this.square) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }

    drawRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        ctx.strokeStyle = this.colorService.primaryColor;
        ctx.lineWidth = this.lineWidth;

        if (this.square) {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }

    drawFillRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        ctx.strokeStyle = this.colorService.primaryColor;
        ctx.fillStyle = this.colorService.secondaryColor;

        ctx.lineWidth = this.lineWidth;

        if (this.square) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }
    selectRectangle(mousePosition: Vec2, base: boolean): void {
        this.distanceX = mousePosition.x - this.mouseDownCoord.x;
        this.distanceY = mousePosition.y - this.mouseDownCoord.y;
        // width an height calcul while keeping position sign
        this.height = Math.sign(this.distanceY) * Math.abs(Math.min(this.distanceX, this.distanceY));
        this.width = Math.sign(this.distanceX) * Math.abs(Math.min(this.distanceX, this.distanceY));

        if (base) {
            switch (this.subToolSelect) {
                case SubToolselected.tool1: {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawFillRectangle(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition);
                    break;
                }

                case SubToolselected.tool2: {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawRectangleOutline(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition);
                    break;
                }

                case SubToolselected.tool3: {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawFillRectangleOutline(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition);
                    break;
                }
            }
        } else {
            switch (this.subToolSelect) {
                case SubToolselected.tool1:
                    this.drawFillRectangle(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition);
                    break;

                case SubToolselected.tool2:
                    this.drawRectangleOutline(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition);
                    break;

                case SubToolselected.tool3:
                    this.drawFillRectangleOutline(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition);
                    break;
            }
        }
    }
}
