import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
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

    onMouseDown(event: MouseEvent): void {
        this.clearEffectTool();
        this.drawingService.previewCtx.lineWidth = this.lineWidth;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.fillStyle = 'black';

        this.mouseDown = event.button === MouseButton.Left;

        if (this.mouseDown) {
            if (this.startingPos && this.endingPos) {
                this.inSelection = this.isInsideSelection(this.getPositionFromMouse(event));
            }

            this.mouseDownCoord = this.getPositionFromMouse(event);

            // for drawing preview
            if (this.drawingService.isPreviewCanvasBlank()) {
                this.startingPos = this.mouseDownCoord;

                // for  pasting selection
            } else if (!this.inSelection && !this.drawingService.isPreviewCanvasBlank()) {
                // paste image
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pasteSelection(this.imagePosition, this.imageData);
                // undo redo
                const selectRectAc = new SelectionRectAction(
                    this.imagePosition,
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
                this.endingPos = this.startingPos = this.mouseDownCoord;
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {
        // paste image
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.mouseDown) {
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
        }
        this.pasteSelection(this.imagePosition, this.imageData);
        // undo redo
        const selectRectAc = new SelectionRectAction(
            this.imagePosition,
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
        this.endingPos = this.startingPos = this.mouseDownCoord;

        this.mouseDown = false;
        if (this.timerDown) {
            this.subscriptionMoveDown.unsubscribe();
        }
        if (this.timerLeft) {
            this.subscriptionMoveLeft.unsubscribe();
        }
        if (this.timerRight) {
            this.subscriptionMoveRight.unsubscribe();
        }
        if (this.timerUp) {
            this.subscriptionMoveUp.unsubscribe();
        }
        if (this.timerStarted) {
            this.subscriptionTimer.unsubscribe();
        }
    }

    protected drawSelection(imagePosition: Vec2): void {
        this.drawingService.previewCtx.putImageData(this.imageData, imagePosition.x, imagePosition.y);
        this.drawSelectionRect(imagePosition, Math.abs(this.width), Math.abs(this.height));
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
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            // this.pasteArrowSelection();
            this.startingPos.x = this.startingPos.x + this.mouseMouvement.x;
            this.startingPos.y = this.startingPos.y + this.mouseMouvement.y;
            this.endingPos.x = this.endingPos.x + this.mouseMouvement.x;
            this.endingPos.y = this.endingPos.y + this.mouseMouvement.y;

            this.mouseMouvement = { x: 0, y: 0 };
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
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            // this.pasteArrowSelection();
            this.startingPos.x = this.startingPos.x + this.mouseMouvement.x;
            this.startingPos.y = this.startingPos.y + this.mouseMouvement.y;
            this.endingPos.x = this.endingPos.x + this.mouseMouvement.x;
            this.endingPos.y = this.endingPos.y + this.mouseMouvement.y;

            this.mouseMouvement = { x: 0, y: 0 };
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
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            // this.pasteArrowSelection();
            this.startingPos.x = this.startingPos.x + this.mouseMouvement.x;
            this.startingPos.y = this.startingPos.y + this.mouseMouvement.y;
            this.endingPos.x = this.endingPos.x + this.mouseMouvement.x;
            this.endingPos.y = this.endingPos.y + this.mouseMouvement.y;

            this.mouseMouvement = { x: 0, y: 0 };
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
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            // this.pasteArrowSelection();
            this.startingPos.x = this.startingPos.x + this.mouseMouvement.x;
            this.startingPos.y = this.startingPos.y + this.mouseMouvement.y;
            this.endingPos.x = this.endingPos.x + this.mouseMouvement.x;
            this.endingPos.y = this.endingPos.y + this.mouseMouvement.y;

            this.mouseMouvement = { x: 0, y: 0 };
            this.timerDown = false;
        }
    }
}
