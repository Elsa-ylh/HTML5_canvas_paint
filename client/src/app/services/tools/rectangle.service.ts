import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    outlineWidth: number = 5;
    fillColor: string = '#ffb366';
    strokeColor: string = '#00ccff';

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawFillRectangleOutline(
                this.drawingService.baseCtx,
                this.mouseDownCoord,
                mousePosition,
                this.outlineWidth,
                this.fillColor,
                this.strokeColor,
            );
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawFillRectangleOutline(
                this.drawingService.previewCtx,
                this.mouseDownCoord,
                mousePosition,
                this.outlineWidth,
                this.fillColor,
                this.strokeColor,
            );
        }
    }

    drawFillRectangle(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2, strokeColor: string): void {
        ctx.strokeStyle = strokeColor;
        ctx.fillRect(mouseDownPos.x, mouseDownPos.y, mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y);
    }

    drawRectangleOutline(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mouseUpPos: Vec2, lineWidth: number, fillColor: string): void {
        ctx.fillStyle = fillColor;
        ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y);
        ctx.lineWidth = lineWidth;
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
        ctx.fillRect(mouseDownPos.x, mouseDownPos.y, mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(mouseDownPos.x, mouseDownPos.y, mouseUpPos.x - mouseDownPos.x, mouseUpPos.y - mouseDownPos.y);
    }
}
