import { Injectable } from '@angular/core';
import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionService } from './selection-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleService extends SelectionService {
    constructor(drawingService: DrawingService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.mouseDownCoord.x !== this.mousePosition.x && this.mouseDownCoord.y !== this.mousePosition.y && !this.inSelection) {
                if (!this.shiftPressed) {
                    this.height = this.mousePosition.y - this.mouseDownCoord.y;
                    this.width = this.mousePosition.x - this.mouseDownCoord.x;
                }

                this.selectRectInitialPos = this.mouseDownCoord;
                this.copyImageInitialPos = this.copySelection();
                this.drawSelection(this.copyImageInitialPos);
            } else if (this.inSelection) {
                this.pasteSelection(
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                    this.imageData,
                );
                // undo redo
                const selectRectAc = new SelectionRectAction(
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                    this.imageData,
                    this.copyImageInitialPos,
                    Math.abs(this.width),
                    Math.abs(this.height),
                    this,
                );
                this.undoRedoService.addUndo(selectRectAc);
                this.undoRedoService.clearRedo();
                this.mouseMouvement = { x: 0, y: 0 };
                this.isAllSelect = false;
            }
        }

        this.mouseDown = false;
        this.inSelection = false;
    }

    protected drawSelection( imagePosition: Vec2): void {
        this.drawingService.previewCtx.putImageData(this.imageData, imagePosition.x, imagePosition.y);
        this.drawSelectionRect( imagePosition, Math.abs(this.width), Math.abs(this.height));
    }

    pasteSelection(position: Vec2, imageData: ImageData): void {
        this.drawingService.baseCtx.putImageData(imageData, position.x, position.y);
    }

    protected drawPreview(): void {
        this.drawPreviewRect(this.drawingService.previewCtx, this.shiftPressed);
    }

    clearSelection(position: Vec2, width: number, height: number): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(position.x, position.y, width, height);
    }

    pasteArrowSelection(): void {
        if (!this.timerStarted) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
            this.pasteSelection(
                { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                this.imageData,
            );
            // undo redo
            const selectRectAc = new SelectionRectAction(

                { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                this.imageData,
                this.copyImageInitialPos,
                Math.abs(this.width),
                Math.abs(this.height),
                this,
            );
            this.undoRedoService.addUndo(selectRectAc);
            this.undoRedoService.clearRedo();
            this.mouseMouvement = { x: 0, y: 0 };
        }
    }

    onLeftArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.leftArrow = false;
            this.resetTimer();
            if (this.timerLeft) {
                this.subscriptionMoveLeft.unsubscribe();
            }
            this.pasteArrowSelection();
            this.timerLeft = false;
        }
    }

    onRightArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.rightArrow = false;
            this.resetTimer();
            if (this.timerRight) {
                this.subscriptionMoveRight.unsubscribe();
            }
            this.pasteArrowSelection();
            this.timerRight = false;
        }
    }

    onUpArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.upArrow = false;
            this.resetTimer();
            if (this.timerUp) {
                this.subscriptionMoveUp.unsubscribe();
            }
            this.pasteArrowSelection();
            this.timerUp = false;
        }
    }

    onDownArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.downArrow = false;
            this.resetTimer();
            if (this.timerDown) {
                this.subscriptionMoveDown.unsubscribe();
            }
            this.pasteArrowSelection();
            this.timerDown = false;
        }
    }
}
