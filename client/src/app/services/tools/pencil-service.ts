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
export class PencilService extends Tool {
    private pathData: Vec2[];
    pencilSize: number = 2;
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }
    minimalPx: number = 2;
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseMove = false;
            this.drawingService.baseCtx.strokeStyle = '#000000'; // to draw after erasing
            this.drawingService.previewCtx.strokeStyle = '#000000';
            this.drawingService.baseCtx.lineWidth = this.pencilSize;
            this.drawingService.previewCtx.lineWidth = this.pencilSize;
            this.drawingService.baseCtx.setLineDash([0, 0]); // reset
            this.drawingService.previewCtx.setLineDash([0, 0]); // reset

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const diametreCir = 1.5;
            const angleCir = 0;
            if (this.mouseMove) {
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.baseCtx, this.pathData);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            } else {
                // draw circle
                this.drawingService.baseCtx.fillStyle = '#000000';
                this.drawingService.previewCtx.fillStyle = '#000000';
                this.drawingService.baseCtx.beginPath();
                this.drawingService.baseCtx.arc(mousePosition.x, mousePosition.y, diametreCir, angleCir, Math.PI * 2);
                this.drawingService.baseCtx.closePath();
                this.drawingService.baseCtx.fill();

                this.drawingService.previewCtx.beginPath();
                this.drawingService.previewCtx.arc(mousePosition.x, mousePosition.y, diametreCir, angleCir, Math.PI * 2);
                this.drawingService.previewCtx.closePath();
                this.drawingService.previewCtx.fill();
            }
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.mouseMove = true;
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
