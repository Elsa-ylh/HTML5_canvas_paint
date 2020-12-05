import { Injectable } from '@angular/core';
import { ControlPointName } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionImage } from '@app/classes/selection';
// import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { SelectionService } from './selection-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleService extends SelectionService {
    constructor(drawingService: DrawingService, protected magnetismService: MagnetismService) {
        super(drawingService, magnetismService);
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
                this.inSelection = this.isInsideSelection(this.mouseDownCoord);
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
                // paste image
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pasteSelection(this.selection);
                // undo redo
                //     const selectRectAc = new SelectionRectAction(
                //         this.selection,
                //         this,
                //     );
                //     this.undoRedoService.addUndo(selectRectAc);
                //     this.undoRedoService.clearRedo();
                this.mouseMovement = { x: 0, y: 0 };
                this.isAllSelect = false;
                this.selection.endingPos = this.mouseDownCoord;
                this.selection.imagePosition = this.mouseDownCoord;
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
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
                this.selection.imagePosition = {
                    x: this.selection.imagePosition.x + this.mouseMovement.x,
                    y: this.selection.imagePosition.y + this.mouseMovement.y,
                };
            }
            // paste image
            this.pasteSelection(this.selection);
            // undo redo
            // const selectRectAc = new SelectionRectAction(
            //     this.imagePosition,
            //     this.imageData,
            //     this.copyImageInitialPos,
            //     Math.abs(this.width),
            //     Math.abs(this.height),
            //     this,
            // );
            // this.undoRedoService.addUndo(selectRectAc);
            // this.undoRedoService.clearRedo();
            this.mouseMovement = { x: 0, y: 0 };
            this.isAllSelect = false;
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
    }

    updateSelectionPositions(): Vec2 {
        const xSign = Math.sign(this.selection.endingPos.x - this.selection.imagePosition.x);
        const ySign = Math.sign(this.selection.endingPos.y - this.selection.imagePosition.y);
        const tmpEndPos = this.selection.endingPos;

        this.selection.width = Math.abs(this.selection.width);
        this.selection.height = Math.abs(this.selection.height);

        if (this.shiftPressed) {
            if (xSign > 0 && ySign > 0) {
                this.selection.endingPos = {
                    x: this.selection.imagePosition.x + this.selection.width,
                    y: this.selection.imagePosition.y + this.selection.height,
                };
                return { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
            }
            if (xSign > 0 && ySign < 0) {
                this.selection.endingPos = { x: this.selection.imagePosition.x + this.selection.width, y: this.selection.imagePosition.y };
                return { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y - this.selection.height };
            }
            if (xSign < 0 && ySign < 0) {
                this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
                return { x: this.selection.imagePosition.x - this.selection.width, y: this.selection.imagePosition.y - this.selection.height };
            } else {
                this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y + this.selection.height };
                return { x: this.selection.imagePosition.x - this.selection.width, y: this.selection.imagePosition.y };
            }
        } else {
            if (xSign > 0 && ySign > 0) {
                return { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
            }
            if (xSign > 0 && ySign < 0) {
                this.selection.endingPos = { x: this.selection.endingPos.x, y: this.selection.imagePosition.y };
                return { x: this.selection.imagePosition.x, y: tmpEndPos.y };
            } else if (xSign < 0 && ySign < 0) {
                this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
                return { x: tmpEndPos.x, y: tmpEndPos.y };
            } else {
                this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.endingPos.y };
                return { x: tmpEndPos.x, y: this.selection.imagePosition.y };
            }
        }
    }

    drawSelection(imagePosition: Vec2): void {
        if (this.scaled) {
            // this.drawingService.previewCtx.save();
            // this.drawingService.previewCtx.translate(this.drawingService.canvas.width, this.drawingService.canvas.height);
            // this.drawingService.previewCtx.scale(-1,-1);
            // this.drawingService.previewCtx.drawImage(this.selection.image, this.drawingService.canvas.width - imagePosition.x,
            // this.drawingService.canvas.height - imagePosition.y, this.selection.width*-1, this.selection.height*-1);
            // this.drawingService.previewCtx.restore();
            // this.drawSelectionRect(imagePosition, this.selection.width, this.selection.height);
            // this.scaled =false;
            // this.selection.getImage({x:this.selection.width, y:this.selection.height});
            this.flipImage();
            this.scaled = false;
            // this.flip.x = 1;
            // this.flip.y = 1;
        }
        this.drawingService.previewCtx.save();
        this.drawingService.previewCtx.drawImage(this.selection.image, imagePosition.x, imagePosition.y, this.selection.width, this.selection.height);
        this.drawingService.previewCtx.restore();
        this.drawSelectionRect(imagePosition, this.selection.width, this.selection.height);
    }

    pasteSelection(selection: SelectionImage): void {
        this.drawingService.baseCtx.drawImage(
            selection.image,
            selection.imagePosition.x,
            selection.imagePosition.y,
            this.selection.width,
            this.selection.height,
        );
    }

    protected drawPreview(): void {
        this.drawPreviewRect(this.drawingService.previewCtx, this.shiftPressed);
    }

    clearSelection(position: Vec2, width: number, height: number): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(position.x, position.y, width, height);
    }

    drawFlippedImage(scale: Vec2, translation: Vec2): void {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const ctx = (canvas.getContext('2d') as CanvasRenderingContext2D) as CanvasRenderingContext2D;
        canvas.width = Math.abs(this.selection.imageSize.x);
        canvas.height = Math.abs(this.selection.imageSize.y);
        ctx.save();
        ctx.translate(translation.x, translation.y);
        ctx.scale(scale.x, scale.y);
        ctx.drawImage(this.baseImage, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        this.selection.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.selection.image = new Image();
        this.selection.image.src = this.selection.getImageURL(this.selection.imageData, this.selection.imageSize.x, this.selection.imageSize.y);
    }
}
