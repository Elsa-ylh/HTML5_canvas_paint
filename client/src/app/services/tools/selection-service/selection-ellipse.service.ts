import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionEllipseAction } from '@app/classes/undo-redo/selection-ellipse-action';
import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionRectangleService } from './selection-rectangle.service';
import { SelectionService } from './selection-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionEllipseService extends SelectionService {
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
            if (this.imagePosition && this.endingPos) {
                this.inSelection = this.isInsideSelection(this.getPositionFromMouse(event));
            }

            this.mouseDownCoord = this.getPositionFromMouse(event);

            // for drawing preview
            if (this.drawingService.isPreviewCanvasBlank()) {
                this.imagePosition = this.mouseDownCoord;

                // for  pasting selection
            } else if (!this.inSelection && !this.drawingService.isPreviewCanvasBlank()) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                if (this.isAllSelect) {
                    // paste image
                    const selectionRectService = new SelectionRectangleService(this.drawingService, this.undoRedoService);
                    selectionRectService.pasteSelection(this.imagePosition, this.image);
                    // undo redo
                    const selectRectAc = new SelectionRectAction(
                        this.imagePosition,
                        this.imageData,
                        this.copyImageInitialPos,
                        Math.abs(this.width),
                        Math.abs(this.height),
                        selectionRectService,
                    );
                    this.undoRedoService.addUndo(selectRectAc);
                } else {
                    // paste image
                    this.pasteSelection(this.imagePosition, this.image, { x: Math.abs(this.width), y: Math.abs(this.height) });
                    // undo redo
                    const selectEllipseAc = new SelectionEllipseAction(
                        this.imagePosition,
                        this.imageData,
                        this.copyImageInitialPos,
                        Math.abs(this.width),
                        Math.abs(this.height),
                        this,
                        this.ellipseRad,
                    );
                    this.undoRedoService.addUndo(selectEllipseAc);
                }
                this.undoRedoService.clearRedo();
                this.isAllSelect = false;
                this.mouseMovement = { x: 0, y: 0 };
                this.width = 0;
                this.height = 0;
                this.endingPos = this.imagePosition = this.mouseDownCoord;
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // if the user is pressing escape while moving the selection
        if (
            this.mouseDown ||
            this.leftArrow.arrowPressed ||
            this.rightArrow.arrowPressed ||
            this.upArrow.arrowPressed ||
            this.downArrow.arrowPressed
        ) {
            this.imagePosition = { x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y };
        }
        if (this.isAllSelect) {
            const selectionRectService = new SelectionRectangleService(this.drawingService, this.undoRedoService);
            // paste image
            selectionRectService.pasteSelection(this.imagePosition, this.image);
            // undo redo
            const selectRectAc = new SelectionRectAction(
                this.imagePosition,
                this.imageData,
                this.copyImageInitialPos,
                Math.abs(this.width),
                Math.abs(this.height),
                selectionRectService,
            );
            this.undoRedoService.addUndo(selectRectAc);
        } else {
            // paste image
            this.pasteSelection(this.imagePosition, this.image, {
                x: Math.abs(this.width),
                y: Math.abs(this.height),
            });
            // undo redo
            const selectEllipseAc = new SelectionEllipseAction(
                this.imagePosition,
                this.imageData,
                this.copyImageInitialPos,
                Math.abs(this.width),
                Math.abs(this.height),
                this,
                this.ellipseRad,
            );
            this.undoRedoService.addUndo(selectEllipseAc);
        }
        this.undoRedoService.clearRedo();
        this.isAllSelect = false;
        this.mouseMovement = { x: 0, y: 0 };
        this.endingPos = this.imagePosition = this.mouseDownCoord;

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
        if (this.isAllSelect) {
            this.drawingService.previewCtx.putImageData(this.imageData, imagePosition.x, imagePosition.y);
            this.drawSelectionRect(imagePosition, Math.abs(this.width), Math.abs(this.height));
        } else {
            this.drawingService.previewCtx.save();
            this.drawingService.previewCtx.beginPath();
            this.drawEllipse(this.drawingService.previewCtx, imagePosition, Math.abs(this.width) / 2, Math.abs(this.height) / 2);
            this.drawingService.previewCtx.stroke();
            this.drawingService.previewCtx.clip();
            this.drawingService.previewCtx.drawImage(this.image, imagePosition.x, imagePosition.y);
            this.drawingService.previewCtx.restore();
            this.drawSelectionRect(imagePosition, Math.abs(this.width), Math.abs(this.height));
        }
    }

    pasteSelection(imageposition: Vec2, image: HTMLImageElement, size: Vec2): void {
        if (this.isAllSelect) {
            this.drawingService.baseCtx.putImageData(
                this.imageData,
                this.copyImageInitialPos.x + this.mouseMovement.x,
                this.copyImageInitialPos.y + this.mouseMovement.y,
            );
        } else {
            this.drawingService.baseCtx.save();
            this.drawingService.baseCtx.globalAlpha = 0;
            this.drawingService.baseCtx.beginPath();
            this.drawEllipse(this.drawingService.baseCtx, imageposition, size.x / 2, size.y / 2);
            this.drawingService.baseCtx.stroke();
            this.drawingService.baseCtx.clip();
            this.drawingService.baseCtx.globalAlpha = 1;
            this.drawingService.baseCtx.drawImage(image, imageposition.x, imageposition.y, this.width, this.height);
            this.drawingService.baseCtx.restore();
        }
    }

    protected drawPreview(): void {
        if (this.imagePosition !== this.endingPos) {
            if (!this.shiftPressed) {
                this.ellipseRad = { x: Math.abs(this.width / 2), y: Math.abs(this.height / 2) };
            } else {
                this.ellipseRad = {
                    x: Math.min(Math.abs(this.width / 2), Math.abs(this.height / 2)),
                    y: Math.min(Math.abs(this.width / 2), Math.abs(this.height / 2)),
                };
            }
            this.drawingService.previewCtx.setLineDash([this.dottedSpace, this.dottedSpace]);
            this.drawPreviewRect(this.drawingService.previewCtx, false);
            this.drawingService.previewCtx.beginPath();
            this.drawEllipse(this.drawingService.previewCtx, this.imagePosition, this.width / 2, this.height / 2);
            this.drawingService.previewCtx.stroke();
        }
    }

    drawEllipse(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, radiusX: number, radiusY: number): void {
        let centerX = 0 as number;
        let centerY = 0 as number;
        centerX = mouseCoord.x + radiusX;
        centerY = mouseCoord.y + radiusY;
        ctx.ellipse(centerX, centerY, this.ellipseRad.x, this.ellipseRad.y, 0, 0, 2 * Math.PI);
    }

    clearSelection(position: Vec2, width: number, height: number): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        if (this.isAllSelect) {
            this.drawingService.baseCtx.fillRect(position.x, position.y, width, height);
        } else {
            this.drawingService.baseCtx.beginPath();
            this.drawEllipse(this.drawingService.baseCtx, position, width / 2, height / 2);
            this.drawingService.baseCtx.fill();
        }
    }

    onLeftArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.leftArrow.arrowPressed = false;
            this.resetTimer();
            if (this.leftArrow.timerStarted) {
                this.leftArrow.subscription.unsubscribe();
            }

            // changing image position
            this.imagePosition = { x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y };
            // this.startingPos.x = this.startingPos.x + this.mouseMovement.x;
            // this.startingPos.y = this.startingPos.y + this.mouseMovement.y;
            this.endingPos.x = this.endingPos.x + this.mouseMovement.x;
            this.endingPos.y = this.endingPos.y + this.mouseMovement.y;

            this.mouseMovement = { x: 0, y: 0 };
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
            this.imagePosition = { x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y };
            // this.startingPos.x = this.startingPos.x + this.mouseMovement.x;
            // this.startingPos.y = this.startingPos.y + this.mouseMovement.y;
            this.endingPos.x = this.endingPos.x + this.mouseMovement.x;
            this.endingPos.y = this.endingPos.y + this.mouseMovement.y;

            this.mouseMovement = { x: 0, y: 0 };
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
            this.imagePosition = { x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y };
            // this.startingPos.x = this.startingPos.x + this.mouseMovement.x;
            // this.startingPos.y = this.startingPos.y + this.mouseMovement.y;
            this.endingPos.x = this.endingPos.x + this.mouseMovement.x;
            this.endingPos.y = this.endingPos.y + this.mouseMovement.y;

            this.mouseMovement = { x: 0, y: 0 };
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
            this.imagePosition = { x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y };
            // this.startingPos.x = this.startingPos.x + this.mouseMovement.x;
            // this.startingPos.y = this.startingPos.y + this.mouseMovement.y;
            this.endingPos.x = this.endingPos.x + this.mouseMovement.x;
            this.endingPos.y = this.endingPos.y + this.mouseMovement.y;

            this.mouseMovement = { x: 0, y: 0 };
            this.downArrow.timerStarted = false;
        }
    }

    pasteImage(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.pasteSelection(this.imagePosition, this.image, { x: Math.abs(this.width), y: Math.abs(this.height) });
        }
        this.cleared = true;
        this.imageData = this.clipboard.imageData;
        this.imagePosition = { x: 1, y: 1 };
        this.width = this.clipboard.width;
        this.height = this.clipboard.height;
        // this.startingPos = { x: 1, y: 1 };
        this.ellipseRad = { x: this.clipboard.ellipseRad.x, y: this.clipboard.ellipseRad.y };
        this.endingPos = { x: Math.abs(this.width), y: Math.abs(this.height) };
        this.image = new Image();
        this.image.src = this.getImageURL(this.clipboard.imageData, this.width, this.height);
        this.drawSelection({ x: 1, y: 1 });
    }
}
