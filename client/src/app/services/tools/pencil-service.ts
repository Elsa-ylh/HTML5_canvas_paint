import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { StrokeAction } from '@app/classes/undo-redo/strokeAction';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    pencilSize: number = 2;

    //private pathData: [Vec2[], string[]]; // tuple de vec2 et de string (couleur)
    private pathData: Vec2[];
    // private intiColor: string[];

    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
        // this.pathData[0] = [];
        //this.pathData[1] = [];
        this.clearPath();
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseMove = false;
            this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor; // to draw after erasing
            this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
            this.drawingService.baseCtx.lineWidth = this.pencilSize;
            this.drawingService.previewCtx.lineWidth = this.pencilSize;
            this.clearEffectTool();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            // TODO mettre couleur initiale // use getcolor de colorservice
            // this.pushData(this.mouseDownCoord, this.getInitColor(event));
            this.pathData.push(this.mouseDownCoord);
        }
        this.clearPath();
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const diametreCir = this.pencilSize / 2;
            const angleCir = 0;
            if (this.mouseMove) {
                // TODO couleur initiale
                // this.pushData(mousePosition, this.getInitColor(event)); // for the undo-redo action
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.baseCtx, this.pathData);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            } else {
                // draw circle
                this.drawingService.baseCtx.fillStyle = '#000000';
                this.drawingService.previewCtx.fillStyle = '#000000';
                this.clearPath();
                this.drawingService.baseCtx.arc(mousePosition.x, mousePosition.y, diametreCir, angleCir, Math.PI * 2);
                // TODO couleur initiale
                this.pathData.push(mousePosition);
                // this.pushData(mousePosition, this.getInitColor(event));
                this.drawLine(this.drawingService.baseCtx, this.pathData);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            }
        }
        this.mouseDown = false;
        // TODO mettre pathData + couleur finale dans l'objet d'action // coinstucor(action) d=styje action
        //addUndo(action) dans service
        // this.intiColor.push(this.getInitColor(event));
        let action = new StrokeAction(this.pathData, this.getInitColor(event), this.colorService.primaryColor, this, this.drawingService);
        this.undoRedoService.addUndo(action);
        console.log('pushed action');
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition); // nmettre avec this.pathdata/
            // this.pushData(mousePosition, this.getInitColor(event));

            this.mouseMove = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.lineJoin = 'round';
        this.drawingService.previewCtx.lineCap = 'round';
        this.drawingService.previewCtx.lineJoin = 'round';
        this.drawingService.baseCtx.setLineDash([0, 0]); // reset
        this.drawingService.previewCtx.setLineDash([0, 0]);
    }

    // todo getColor position
    // get the initial color
    getInitColor(event: MouseEvent): string {
        const position = { x: event.offsetX, y: event.offsetY };
        const initialColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.drawingService.baseCtx));
        return initialColor;
    }

    // PUSH POSITION + COULEUR INITIALE
    //  pushData(mousePosition: Vec2, initColor: string): void {
    //  this.pathData[0].push(mousePosition);
    // this.pathData[1].push(initColor);
    //   }

    clearPath(): void {
        // this.pathData[0].splice(0, 10); // clears all elements of pathdata
        this.pathData = [];
    }
}
