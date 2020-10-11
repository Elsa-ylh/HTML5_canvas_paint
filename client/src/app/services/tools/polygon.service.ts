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
export class PolygonService extends Tool {
    lineWidth: number = 1;
    fillColor: string;
    strokeColor: string;
    mousePosition: Vec2;
    distanceX: number;
    distanceY: number;
    dottedLineWidth: number = 2;
    dottedSpace: number = 10;
    numberOfSides: number = 3; // smallest number of sides allowed
    radius: number;
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    strokeCircleColor: string = '#000000';
    lineCirclewidth: number = 1;
    // tslint:disable-next-line:no-magic-numbers
    possibleNbSides: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // numbers of sides allowed for polygon -> autorized disable magical number

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.drawingService.baseCtx.lineWidth = this.dottedLineWidth;
        this.drawingService.previewCtx.lineWidth = this.dottedLineWidth;
        this.clearEffectTool();
        this.strokeColor = this.colorService.secondaryColor;
        this.fillColor = this.colorService.primaryColor;

        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.previewCtx.lineJoin = this.drawingService.previewCtx.lineCap = 'round';

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
            this.selectPolygon(mousePosition, true);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.mouseEnter = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectPolygon(mousePosition, false);
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

    drawFillPolygon(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        this.drawingService.baseCtx.beginPath();
        this.drawingService.previewCtx.beginPath();

        ctx.fillStyle = this.fillColor;
        ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
        this.drawPolygon(ctx, this.numberOfSides);
        ctx.fill();
        this.drawPreviewCircle(ctx, mouseDownPos, mouseUpPos);
    }

    drawPolygonOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        this.drawingService.baseCtx.beginPath();
        this.drawingService.previewCtx.beginPath();

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.setLineDash([0, 0]);
        this.drawPolygon(ctx, this.numberOfSides);
        ctx.stroke();

        this.drawPreviewCircle(ctx, mouseDownPos, mouseUpPos);
    }

    drawFillPolygonOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2): void {
        this.drawingService.baseCtx.beginPath();
        this.drawingService.previewCtx.beginPath();

        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([0, 0]);
        this.drawPolygon(ctx, this.numberOfSides);
        ctx.stroke();
        ctx.fill();

        this.drawPreviewCircle(ctx, mouseDownPos, mouseUpPos);
    }

    selectPolygon(mousePosition: Vec2, base: boolean): void {
        this.distanceX = mousePosition.x - this.mouseDownCoord.x;
        this.distanceY = mousePosition.y - this.mouseDownCoord.y;
        this.radius = Math.sqrt(Math.pow(mousePosition.x - this.mouseDownCoord.x, 2) + Math.pow(mousePosition.y - this.mouseDownCoord.y, 2));
        if (base) {
            switch (this.subToolSelect) {
                case SubToolselected.tool1: {
                    this.drawFillPolygon(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition);
                    break;
                }

                case SubToolselected.tool2: {
                    this.drawPolygonOutline(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition);
                    break;
                }

                case SubToolselected.tool3: {
                    this.drawFillPolygonOutline(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition);
                    break;
                }
            }
        } else {
            switch (this.subToolSelect) {
                case SubToolselected.tool1:
                    this.drawFillPolygon(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition);
                    break;

                case SubToolselected.tool2:
                    this.drawPolygonOutline(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition);
                    break;

                case SubToolselected.tool3:
                    this.drawFillPolygonOutline(this.drawingService.previewCtx, this.mouseDownCoord, mousePosition);
                    break;
            }
        }
    }

    // draw a basic Polygon
    private drawPolygon(ctx: CanvasRenderingContext2D, numberOfSides: number): void {
        const angle = (Math.PI * 2) / numberOfSides;

        this.drawingService.previewCtx.beginPath();
        this.drawingService.baseCtx.beginPath();

        ctx.moveTo(this.mouseDownCoord.x + this.radius * Math.cos(0), this.mouseDownCoord.y + this.radius * Math.sin(0));
        for (let i = 1; i <= numberOfSides; i++) {
            ctx.lineTo(this.mouseDownCoord.x + this.radius * Math.cos(i * angle), this.mouseDownCoord.y + this.radius * Math.sin(i * angle));
        }
    }

    drawPreviewCircle(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mousePosition: Vec2): void {
        if (this.drawingService.previewCtx === ctx) {
            ctx.beginPath(); // Define new path for outlined circle
            ctx.strokeStyle = this.strokeCircleColor;
            ctx.lineWidth = this.lineCirclewidth;
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            ctx.arc(this.mouseDownCoord.x, this.mouseDownCoord.y, this.radius + this.lineWidth / 2, 0, 2 * Math.PI, false);
            ctx.stroke();
        }
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
}
