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
            // check if mouse is inside selection
            if (this.startingPos && this.endingPos) {
                this.inSelection = this.isInsideSelection(this.getPositionFromMouse(event));
            }

            this.mouseDownCoords = this.getPositionFromMouse(event);

            // for drawing preview
            if (this.drawingService.isPreviewCanvasBlank()) {
                this.startingPos = this.mouseDownCoords;

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
                this.endingPos = this.mouseDownCoords;
                this.startingPos = this.mouseDownCoords;
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {
        // paste image
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // if the user is pressing escape while moving the selection
        if (
            this.mouseDown ||
            this.leftArrow.arrowPressed ||
            this.rightArrow.arrowPressed ||
            this.upArrow.arrowPressed ||
            this.downArrow.arrowPressed
        ) {
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
        }
        // paste image
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
        this.endingPos = this.startingPos = this.mouseDownCoords;

        this.mouseDown = false;
        if (this.downArrow.timerStarted) {
            this.downArrow.subscription.unsubscribe();
        }
        if (this.leftArrow.timerStarted) {
            this.leftArrow.subscription.unsubscribe();
        }
        if (this.rightArrow.timerStarted) {
            this.rightArrow.subscription.unsubscribe();
        }
        if (this.upArrow.timerStarted) {
            this.upArrow.subscription.unsubscribe();
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

    onLeftArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.leftArrow.arrowPressed = false;
            this.resetTimer();
            if (this.leftArrow.timerStarted) {
                this.leftArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
            this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };

            this.mouseMouvement = { x: 0, y: 0 };
            this.leftArrow.timerStarted = false;
        }
    }

    onRightArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.rightArrow.arrowPressed = false;
            this.resetTimer();
            if (this.rightArrow.timerStarted) {
                this.rightArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
            this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };

            this.mouseMouvement = { x: 0, y: 0 };
            this.rightArrow.timerStarted = false;
        }
    }

    onUpArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.upArrow.arrowPressed = false;
            this.resetTimer();
            if (this.upArrow.timerStarted) {
                this.upArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
            this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };

            this.mouseMouvement = { x: 0, y: 0 };
            this.upArrow.timerStarted = false;
        }
    }

    onDownArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.downArrow.arrowPressed = false;
            this.resetTimer();
            if (this.downArrow.timerStarted) {
                this.downArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
            this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
            this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };

            this.mouseMouvement = { x: 0, y: 0 };
            this.downArrow.timerStarted = false;
        }
    }
}
