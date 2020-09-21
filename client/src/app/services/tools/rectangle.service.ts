import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingInformationsService } from '@app/services/drawing-info/drawing-informations.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    fillColor: string = '#ffb366';
    strokeColor: string = '#00ccff';
    square: boolean = false;
    height: number;
    width: number;
    mousePosition: Vec2;
    leftMouseDown: boolean = false;

    constructor(drawingService: DrawingService, public drawingInfos: DrawingInformationsService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Right;
        this.leftMouseDown = true;
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
        this.leftMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectRectangle(mousePosition, false);
        }
    }

    OnShiftKeyDown(event: KeyboardEvent): void {
        this.square = true;
        if (this.leftMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectRectangle(this.mousePosition, false);
        }
    }

    OnShiftKeyUp(event: KeyboardEvent): void {
        this.square = false;
        if (this.leftMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectRectangle(this.mousePosition, false);
        }
    }

    calcSign(x: number): number {
        if (x < 0) return -Math.abs(x / x);
        else return 1;
    }

    drawFillRectangle(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2, fillColor: string): void {
        this.height = this.calcSign(mouseUpPos.y - mouseDownPos.y) * Math.abs(Math.min(mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y));
        this.width = this.calcSign(mouseUpPos.x - mouseDownPos.x) * Math.abs(Math.min(mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y));
        ctx.fillStyle = fillColor;
        if (this.square) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y);
        }
    }

    drawRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2, lineWidth: number, strokeColor: string): void {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        this.height = this.calcSign(mouseUpPos.y - mouseDownPos.y) * Math.abs(Math.min(mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y));
        this.width = this.calcSign(mouseUpPos.x - mouseDownPos.x) * Math.abs(Math.min(mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y));

        if (this.square) {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y);
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
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        this.height = this.calcSign(mouseUpPos.y - mouseDownPos.y) * Math.abs(Math.min(mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y));
        this.width = this.calcSign(mouseUpPos.x - mouseDownPos.x) * Math.abs(Math.min(mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y));
        if (this.square) {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, this.width, this.height);
        } else {
            ctx.fillRect(mouseDownPos.x, mouseDownPos.y, mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y);
            ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y);
        }
    }

    selectRectangle(mousePosition: Vec2, base: boolean): void {
        if (base) {
            switch (this.subToolSelect) {
                case SubToolselected.tool1: {
                    this.drawFillRectangle(this.drawingService.baseCtx, this.mouseDownCoord, mousePosition, this.fillColor);
                    break;
                }

                case SubToolselected.tool2: {
                    this.drawRectangleOutline(
                        this.drawingService.baseCtx,
                        this.mouseDownCoord,
                        mousePosition,
                        this.drawingInfos.lineWidth,
                        this.strokeColor,
                    );
                    break;
                }

                case SubToolselected.tool3: {
                    this.drawFillRectangleOutline(
                        this.drawingService.baseCtx,
                        this.mouseDownCoord,
                        mousePosition,
                        this.drawingInfos.lineWidth,
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
                    this.drawRectangleOutline(
                        this.drawingService.previewCtx,
                        this.mouseDownCoord,
                        mousePosition,
                        this.drawingInfos.lineWidth,
                        this.strokeColor,
                    );
                    break;

                case SubToolselected.tool3:
                    this.drawFillRectangleOutline(
                        this.drawingService.previewCtx,
                        this.mouseDownCoord,
                        mousePosition,
                        this.drawingInfos.lineWidth,
                        this.fillColor,
                        this.strokeColor,
                    );
                    break;
            }
        }
    }
}
