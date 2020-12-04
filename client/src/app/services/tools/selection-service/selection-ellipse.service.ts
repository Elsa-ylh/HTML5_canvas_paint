import { Injectable } from '@angular/core';
import { ControlPointName } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionImage } from '@app/classes/selection';
import { SelectionEllipseAction } from '@app/classes/undo-redo/selection-ellipse-action';
import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
// import { SelectionEllipseAction } from '@app/classes/undo-redo/selection-ellipse-action';
// import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RotationService } from './rotation.service';
import { SelectionRectangleService } from './selection-rectangle.service';
// import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
// import { SelectionRectangleService } from './selection-rectangle.service';
import { SelectionService } from './selection-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionEllipseService extends SelectionService {
    constructor(
        drawingService: DrawingService,
        protected magnetismService: MagnetismService,
        protected rotationService: RotationService,
        private undoRedoService: UndoRedoService,
    ) {
        super(drawingService, magnetismService, rotationService);
    }

    onMouseDown(event: MouseEvent): void {
        this.clearEffectTool();
        this.drawingService.previewCtx.lineWidth = this.lineWidth;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.fillStyle = 'black';

        this.mouseDown = event.button === MouseButton.Left;

        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.previousMousePos = this.getPositionFromMouse(event);

            // check if mouse is inside selection
            if (this.selection.imagePosition && this.selection.endingPos) {
                this.inSelection = this.isInsideSelection(this.getPositionFromMouse(event));
            }

            // check if mouse is inside a control point
            if (!this.drawingService.isPreviewCanvasBlank()) {
                this.controlPointName = this.controlGroup.isInControlPoint(this.mouseDownCoord);
            }
            // for drawing preview
            if (this.drawingService.isPreviewCanvasBlank()) {
                this.selection.imagePosition = this.mouseDownCoord;

                // for  pasting selection
            } else if (!this.inSelection && !this.drawingService.isPreviewCanvasBlank() && this.controlPointName === ControlPointName.none) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                if (this.isAllSelect) {
                    // paste image
                    const selectionRectService = new SelectionRectangleService(
                        this.drawingService,
                        this.magnetismService,
                        this.rotationService,
                        this.undoRedoService,
                    );
                    selectionRectService.pasteSelection(this.selection);
                    const selectRectAc = new SelectionRectAction(selectionRectService, this.drawingService, this.selection);
                    this.undoRedoService.addUndo(selectRectAc);
                } else {
                    // paste image
                    this.pasteSelection(this.selection);
                    // undo redo
                    const selectEllAc = new SelectionEllipseAction(this, this.drawingService, this.selection);
                    this.undoRedoService.addUndo(selectEllAc);
                }
                this.undoRedoService.clearRedo();
                this.isAllSelect = false;
                this.mouseMovement = { x: 0, y: 0 };
                this.selection.width = 0;
                this.selection.height = 0;
                this.selection.endingPos = this.selection.imagePosition = this.mouseDownCoord;
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
            this.selection.imagePosition = {
                x: this.selection.imagePosition.x + this.mouseMovement.x,
                y: this.selection.imagePosition.y + this.mouseMovement.y,
            };
        }
        if (this.isAllSelect) {
            const selectionRectService = new SelectionRectangleService(
                this.drawingService,
                this.magnetismService,
                this.rotationService,
                this.undoRedoService,
            );
            selectionRectService.pasteSelection(this.selection);
            const selectRectAc = new SelectionRectAction(selectionRectService, this.drawingService, this.selection);
            this.undoRedoService.addUndo(selectRectAc);
        } else {
            // paste image
            this.pasteSelection(this.selection);
            // undo redo
            const selectEllAc = new SelectionEllipseAction(this, this.drawingService, this.selection);
            this.undoRedoService.addUndo(selectEllAc);
        }
        this.undoRedoService.clearRedo();
        this.isAllSelect = false;
        this.mouseMovement = { x: 0, y: 0 };
        this.selection.endingPos = this.selection.imagePosition = this.mouseDownCoord;

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

    drawSelection(imagePosition: Vec2): void {
        if (this.isAllSelect) {
            this.drawSelectionAll();
        } else {
            if (this.scaled) {
                this.flipImage();
                this.scaled = false;
            }
            this.drawingService.previewCtx.save();
            this.drawingService.previewCtx.beginPath();
            this.drawEllipse(this.drawingService.previewCtx, imagePosition, this.selection.width / 2, this.selection.height / 2);
            this.drawingService.previewCtx.stroke();
            this.drawingService.previewCtx.clip();
            // rotate
            this.rotationService.rotateSelection(this.selection, this.drawingService.previewCtx);
            this.drawingService.previewCtx.drawImage(
                this.selection.image,
                imagePosition.x,
                imagePosition.y,
                this.selection.width,
                this.selection.height,
            );
            this.drawingService.previewCtx.restore();
            this.drawSelectionRect(imagePosition, this.selection.width, this.selection.height);
        }
    }

    private drawSelectionAll(): void {
        this.drawingService.previewCtx.save();
        this.rotationService.rotateSelection(this.selection, this.drawingService.baseCtx);
        this.drawingService.previewCtx.drawImage(
            this.selection.image,
            this.selection.imagePosition.x,
            this.selection.imagePosition.y,
            this.selection.width,
            this.selection.height,
        );
        this.drawingService.previewCtx.restore();
        this.drawSelectionRect(this.selection.imagePosition, this.selection.width, this.selection.height);
    }

    pasteSelection(selection: SelectionImage): void {
        if (this.isAllSelect) {
            const selectionRectService = new SelectionRectangleService(
                this.drawingService,
                this.magnetismService,
                this.rotationService,
                this.undoRedoService,
            );
            selectionRectService.pasteSelection(this.selection);
        } else {
            this.drawingService.baseCtx.save();
            this.drawingService.baseCtx.globalAlpha = 0;
            this.drawingService.baseCtx.beginPath();
            this.drawEllipse(this.drawingService.baseCtx, selection.imagePosition, selection.width / 2, selection.height / 2);
            this.drawingService.baseCtx.stroke();
            this.drawingService.baseCtx.clip();
            this.drawingService.baseCtx.globalAlpha = 1;
            // rotate
            this.rotationService.rotateSelection(this.selection, this.drawingService.baseCtx);
            this.drawingService.baseCtx.drawImage(
                selection.image,
                selection.imagePosition.x,
                selection.imagePosition.y,
                selection.width,
                selection.height,
            );
            this.drawingService.baseCtx.restore();
            this.rotationService.resetAngle();
        }
    }

    protected drawPreview(): void {
        if (this.selection.imagePosition !== this.selection.endingPos) {
            if (!this.shiftPressed) {
                this.selection.ellipseRad = { x: Math.abs(this.selection.width / 2), y: Math.abs(this.selection.height / 2) };
            } else {
                this.selection.ellipseRad = {
                    x: Math.min(Math.abs(this.selection.width / 2), Math.abs(this.selection.height / 2)),
                    y: Math.min(Math.abs(this.selection.width / 2), Math.abs(this.selection.height / 2)),
                };
            }
            this.drawingService.previewCtx.setLineDash([this.dottedSpace, this.dottedSpace]);
            this.drawPreviewRect(this.drawingService.previewCtx, false);
            this.drawingService.previewCtx.beginPath();
            this.drawEllipse(this.drawingService.previewCtx, this.selection.imagePosition, this.selection.width / 2, this.selection.height / 2);
            this.drawingService.previewCtx.stroke();
        }
    }

    drawEllipse(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, radiusX: number, radiusY: number): void {
        let centerX = 0 as number;
        let centerY = 0 as number;
        centerX = mouseCoord.x + radiusX;
        centerY = mouseCoord.y + radiusY;
        ctx.ellipse(centerX, centerY, Math.abs(this.selection.ellipseRad.x), Math.abs(this.selection.ellipseRad.y), 0, 0, 2 * Math.PI);
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
}
