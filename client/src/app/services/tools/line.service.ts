import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { LineAction } from '@app/classes/undo-redo/line-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { AutomaticSaveService } from '../automatic-save/automatic-save.service';

export interface LineParameters {
    data: Vec2[];
    selectedLineTool: SubToolselected;
}

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    secondarySizePixel: number = 2; //
    lineWidth: number = 2; //
    private pathData: Vec2[] = []; //
    isBallOn: boolean = false;
    private pointMouse: Vec2 = { x: 0, y: 0 }; //
    private pointShiftMemory: Vec2 = { x: 0, y: 0 }; //
    private colorLine: string = this.colorService.primaryColor;
    private shiftKeyDown: boolean = false;
    private mouseOut: boolean = false;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private undoRedoService: UndoRedoService,
        private automaticSaveSer: AutomaticSaveService,
    ) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.mouseDown) this.clearEffectTool();
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown && !this.shiftKeyDown && !this.mouseOut) {
            this.mouseMove = true;
            this.pathData.push(this.getPositionFromMouse(event));
            this.drawLine(this.drawingService.previewCtx, { data: this.pathData, selectedLineTool: this.subToolSelect }, this.lineWidth);
            return;
        }
        if (this.mouseDown && this.shiftKeyDown) {
            this.pathData.push(this.pointMouse);
            this.drawLine(this.drawingService.previewCtx, { data: this.pathData, selectedLineTool: this.subToolSelect }, this.lineWidth);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseMove && !this.shiftKeyDown) {
            this.pointShiftMemory = this.pointMouse = this.getPositionFromMouse(event);
            this.drawLineLastPoint(this.drawingService.previewCtx, { data: this.pathData, selectedLineTool: this.subToolSelect }, this.pointMouse);
            return;
        }
        if (this.shiftKeyDown) {
            this.pointShiftMemory = this.getPositionFromMouse(event);
        }
    }
    onMouseOut(event: MouseEvent): void {
        this.mouseOut = true;
    }
    onMouseEnter(event: MouseEvent): void {
        this.mouseOut = false;
    }
    onShiftKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown && this.mouseMove) {
            this.shiftKeyDown = true;
            this.mouseMove = false;
            this.pointMouse = this.shiftDrawAngleLine(this.pathData, this.pointMouse);
            this.drawLineLastPoint(this.drawingService.previewCtx, { data: this.pathData, selectedLineTool: this.subToolSelect }, this.pointMouse);
        }
    }

    onShiftKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown && this.shiftKeyDown) {
            this.mouseMove = true;
            this.shiftKeyDown = false;
            this.drawLineLastPoint(
                this.drawingService.previewCtx,
                { data: this.pathData, selectedLineTool: this.subToolSelect },
                this.pointShiftMemory,
            );
        }
    }

    private shiftDrawAngleLine(path: Vec2[], lastPoint: Vec2): Vec2 {
        const leastone = -1;
        const denominator8 = 8;
        const denominator4 = 4;
        const numerator7 = 7;
        const numerator5 = 5;
        const numerator3 = 3;
        const firstPoint = path[path.length + leastone];
        const dx = lastPoint.x - firstPoint.x;
        const dy = lastPoint.y - firstPoint.y;
        const angleabs = Math.abs(Math.atan2(dy, dx));
        if (angleabs < Math.PI / denominator8 || angleabs > (Math.PI * numerator7) / denominator8) {
            return { x: lastPoint.x, y: firstPoint.y };
        }
        if (angleabs >= Math.PI / denominator8 && angleabs <= (Math.PI * numerator3) / denominator8) {
            const axey: number = dy > 0 ? leastone : 1;
            const newY: number = Math.round(Math.tan((Math.PI * numerator3) / denominator4) * dx * axey);
            return { x: lastPoint.x, y: firstPoint.y + newY };
        }
        if (angleabs <= (Math.PI * numerator7) / denominator8 && angleabs >= (Math.PI * numerator5) / denominator8) {
            const axey: number = dy > 0 ? leastone : 1;
            const newY: number = Math.round(Math.tan(Math.PI / denominator4) * dx * axey);
            return { x: lastPoint.x, y: firstPoint.y + newY };
        }
        return { x: firstPoint.x, y: lastPoint.y };
    }

    onDoubleClick(event: MouseEvent): void {
        if (this.mergeFirstPoint(this.pathData)) {
            this.pathData[this.pathData.length - 1] = this.pathData[0];
        }
        this.drawLine(this.drawingService.baseCtx, { data: this.pathData, selectedLineTool: this.subToolSelect }, this.lineWidth);
        // undo-redo
        this.colorLine = this.colorService.primaryColor;
        const actionLine = new LineAction(
            this.pathData,
            this.pointMouse,
            this.colorLine,
            this.lineWidth,
            this.secondarySizePixel,
            this,
            this.drawingService,
            this.subToolSelect,
        );
        this.undoRedoService.addUndo(actionLine);
        this.undoRedoService.clearRedo();

        this.clearPath();
        this.clearEffectTool();
        this.mouseDown = false;
        this.automaticSaveSer.save();
    }

    onKeyEscape(event: KeyboardEvent): void {
        if (this.mouseDown) {
            this.clearPath();
            this.clearEffectTool();
            this.mouseDown = false;
        }
    }

    onKeyBackSpace(event: KeyboardEvent): void {
        if (this.mouseDown && this.pathData.length > 1) {
            this.pathData.pop();
            this.drawLineLastPoint(this.drawingService.previewCtx, { data: this.pathData, selectedLineTool: this.subToolSelect }, this.pointMouse);
        }
    }
    drawLine(ctx: CanvasRenderingContext2D, path: LineParameters, lineWidth: number): void {
        ctx.lineWidth = lineWidth;
        this.clearPreviewCtx();
        ctx.beginPath();
        for (const point of path.data) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();

        if (path.selectedLineTool === SubToolselected.tool2) this.drawPoint(ctx, path.data, this.secondarySizePixel);
    }

    drawLineLastPoint(ctx: CanvasRenderingContext2D, path: LineParameters, lastPoint: Vec2): void {
        this.clearPreviewCtx();
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'bevel';
        ctx.beginPath();
        for (const point of path.data) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(lastPoint.x, lastPoint.y);
        ctx.stroke();
        if (path.selectedLineTool === SubToolselected.tool2) this.drawPoint(ctx, path.data, this.secondarySizePixel);
    }

    drawPoint(ctx: CanvasRenderingContext2D, path: Vec2[], secondPixelSize: number): void {
        ctx.lineJoin = ctx.lineCap = 'round';
        const sizePx = ctx.lineWidth;
        ctx.lineWidth = secondPixelSize;
        for (const point of path) {
            ctx.beginPath();
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
        ctx.lineWidth = sizePx;
    }

    private mergeFirstPoint(path: Vec2[]): boolean {
        const maximumDistance = 20;
        const firstPoint = path[0];
        const lastPoint = path[path.length - 1];
        const dx = Math.abs(lastPoint.x - firstPoint.x);
        const dy = Math.abs(lastPoint.y - firstPoint.y);
        return dx <= maximumDistance && dy <= maximumDistance;
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
        this.drawingService.baseCtx.lineJoin = 'bevel';
        this.drawingService.baseCtx.lineCap = 'butt';
        this.drawingService.previewCtx.lineJoin = 'bevel';
        this.drawingService.previewCtx.lineCap = 'butt';
        this.drawingService.previewCtx.lineWidth = this.drawingService.baseCtx.lineWidth = this.lineWidth;
        this.drawingService.baseCtx.setLineDash([]); // reset
        this.drawingService.previewCtx.setLineDash([]);
        this.clearPreviewCtx();
    }

    clearPreviewCtx(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    clearPath(): void {
        this.pathData = [];
        this.shiftKeyDown = false;
        this.mouseDown = this.mouseMove = false;
        this.pointMouse = { x: 0, y: 0 };
        this.shiftKeyDown = false;
        this.pointShiftMemory = { x: 0, y: 0 };
    }
}
