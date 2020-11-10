import { Injectable } from '@angular/core';
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

    ellipseRad: Vec2 = { x: 0, y: 0 };

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
                this.copyImageInitialPos = this.copySelection();
                this.drawSelection(this.copyImageInitialPos);
            } else if (this.inSelection) {
                this.pasteSelection(
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                    this.image,
                    { x: Math.abs(this.width), y: Math.abs(this.height) },
                );
                // undo redo
                if (this.isAllSelect) {
                    const selectionRectService = new SelectionRectangleService(this.drawingService, this.undoRedoService);
                    const selectRectAc = new SelectionRectAction(
                        { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                        this.imageData,
                        this.copyImageInitialPos,
                        Math.abs(this.width),
                        Math.abs(this.height),
                        selectionRectService,
                    );
                    this.undoRedoService.addUndo(selectRectAc);
                } else {
                    const selectEllipseAc = new SelectionEllipseAction(
                        { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                        this.imageData,
                        this.copyImageInitialPos,
                        Math.abs(this.width),
                        Math.abs(this.height),
                        this,
                    );
                    this.undoRedoService.addUndo(selectEllipseAc);
                }
                this.undoRedoService.clearRedo();
                this.isAllSelect = false;
                this.mouseMouvement = { x: 0, y: 0 };
            }
        }

        this.mouseDown = false;
        this.inSelection = false;
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
                this.copyImageInitialPos.x + this.mouseMouvement.x,
                this.copyImageInitialPos.y + this.mouseMouvement.y,
            );
        } else {
            this.drawingService.baseCtx.save();
            this.drawingService.baseCtx.globalAlpha = 0;
            this.drawingService.baseCtx.beginPath();
            this.drawEllipse(this.drawingService.baseCtx, imageposition, size.x / 2, size.y / 2);
            this.drawingService.baseCtx.stroke();
            this.drawingService.baseCtx.clip();
            this.drawingService.baseCtx.globalAlpha = 1;
            this.drawingService.baseCtx.drawImage(image, imageposition.x, imageposition.y);
            this.drawingService.baseCtx.restore();
        }
    }

    protected drawPreview(): void {
        if (this.mouseDownCoord !== this.mousePosition) {
            this.drawingService.previewCtx.setLineDash([this.dottedSpace, this.dottedSpace]);
            this.drawPreviewRect(this.drawingService.previewCtx, false);
            this.drawingService.previewCtx.beginPath();
            this.drawEllipse(this.drawingService.previewCtx, this.mouseDownCoord, this.width / 2, this.height / 2);
            this.drawingService.previewCtx.stroke();
        }
    }

    drawEllipse(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, radiusX: number, radiusY: number): void {
        let centerX = 0 as number;
        let centerY = 0 as number;
        centerX = mouseCoord.x + radiusX;
        centerY = mouseCoord.y + radiusY;
        if (!this.inSelection) {
            if (this.shiftPressed) {
                this.ellipseRad.x = Math.min(Math.abs(radiusX), Math.abs(radiusY));
                this.ellipseRad.y = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            } else {
                this.ellipseRad.x = Math.abs(radiusX);
                this.ellipseRad.y = Math.abs(radiusY);
            }
        }

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

    pasteArrowSelection(): void {
        if (!this.timerStarted) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
            this.pasteSelection(
                { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                this.image,
                { x: Math.abs(this.width), y: Math.abs(this.height) },
            );
            // undo-redo
            if (this.isAllSelect) {
                const selectionRectService = new SelectionRectangleService(this.drawingService, this.undoRedoService);
                const selectRectAc = new SelectionRectAction(
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                    this.imageData,
                    this.copyImageInitialPos,
                    Math.abs(this.width),
                    Math.abs(this.height),
                    selectionRectService,
                );
                this.undoRedoService.addUndo(selectRectAc);
            } else {
                const selectEllipseAc = new SelectionEllipseAction(
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                    this.imageData,
                    this.copyImageInitialPos,
                    Math.abs(this.width),
                    Math.abs(this.height),
                    this,
                );
                this.undoRedoService.addUndo(selectEllipseAc);
            }

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
