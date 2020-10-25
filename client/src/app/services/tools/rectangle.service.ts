import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { ToolGeneralInfo } from '@app/classes/toolGeneralInfo';
// import { RectangleAction } from '@app/classes/undo-redo/rectangleAction';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    lineWidth: number = 1; //
    fillColor: string; //
    strokeColor: string; //
    // square: boolean = false; // shift
    height: number; //
    width: number; //
    mousePosition: Vec2; //
    base: boolean; // quel canvas
    distanceX: number; //
    distanceY: number; //
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    generalInfo: ToolGeneralInfo = {
        primaryColor: 'black',
        secondaryColor: 'black',
        lineWidth: 1,
        shiftPressed: false,
        selectSubTool: SubToolselected.tool1,
        canvasSelected: false,
    };

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        // rajoute private undoRedoService: UndoRedoService
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.clearEffectTool();
        this.generalInfo.secondaryColor = this.colorService.secondaryColor;
        this.generalInfo.primaryColor = this.colorService.primaryColor;

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
            this.generalInfo.canvasSelected = true;
            this.selectRectangle(mousePosition, this.mouseDownCoord, this.generalInfo);
        }
        this.mouseDown = false;
        this.mouseEnter = false;

        // undo redo

        // const rectAction = new RectangleAction(this.mousePosition, this.base, this, this.drawingService);
        // this.undoRedoService.addUndo(rectAction);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.generalInfo.canvasSelected = false;
            this.selectRectangle(mousePosition, this.mouseDownCoord, this.generalInfo);
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

    onShiftKeyDown(event: KeyboardEvent): void {
        this.generalInfo.shiftPressed = true;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.generalInfo.canvasSelected = false;
            this.selectRectangle(this.mousePosition, this.mouseDownCoord, this.generalInfo);
        }
    }

    onShiftKeyUp(event: KeyboardEvent): void {
        this.generalInfo.shiftPressed = false;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.generalInfo.canvasSelected = false;
            this.selectRectangle(this.mousePosition, this.mouseDownCoord, this.generalInfo);
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

    drawFillRectangle(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2): void {
        ctx.fillStyle = this.fillColor;

        if (this.generalInfo.shiftPressed) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }

    drawRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2): void {
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.generalInfo.lineWidth;

        if (this.generalInfo.shiftPressed) {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }

    drawFillRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2): void {
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;

        ctx.lineWidth = this.generalInfo.lineWidth;

        if (this.generalInfo.shiftPressed) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.distanceX, this.distanceY);
        }
    }
    selectRectangle(mousePosition: Vec2, mouseDownCoord: Vec2, generalInfo: ToolGeneralInfo): void {
        this.strokeColor = generalInfo.secondaryColor;
        this.fillColor = generalInfo.primaryColor;
        this.distanceX = mousePosition.x - mouseDownCoord.x;
        this.distanceY = mousePosition.y - mouseDownCoord.y;
        // width an height calcul while keeping position sign
        this.height = Math.sign(this.distanceY) * Math.abs(Math.min(this.distanceX, this.distanceY));
        this.width = Math.sign(this.distanceX) * Math.abs(Math.min(this.distanceX, this.distanceY));

        if (generalInfo.canvasSelected) {
            switch (this.subToolSelect) {
                case SubToolselected.tool1: {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawFillRectangle(this.drawingService.baseCtx, mouseDownCoord);
                    break;
                }

                case SubToolselected.tool2: {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawRectangleOutline(this.drawingService.baseCtx, mouseDownCoord);
                    break;
                }

                case SubToolselected.tool3: {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawFillRectangleOutline(this.drawingService.baseCtx, mouseDownCoord);
                    break;
                }
            }
        } else {
            switch (this.subToolSelect) {
                case SubToolselected.tool1:
                    this.drawFillRectangle(this.drawingService.previewCtx, mouseDownCoord);
                    break;

                case SubToolselected.tool2:
                    this.drawRectangleOutline(this.drawingService.previewCtx, mouseDownCoord);
                    break;

                case SubToolselected.tool3:
                    this.drawFillRectangleOutline(this.drawingService.previewCtx, mouseDownCoord);
                    break;
            }
        }
    }
}
