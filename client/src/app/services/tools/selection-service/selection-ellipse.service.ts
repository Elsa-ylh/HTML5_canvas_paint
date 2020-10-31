import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionEllipseService extends SelectionService {
    constructor(drawingService: DrawingService) {
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
                this.drawSelection(this.drawingService.previewCtx, this.mouseDownCoord, this.copyImageInitialPos);
            } else if (this.inSelection) {
                this.pasteSelection(
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                    { x: this.selectRectInitialPos.x + this.mouseMouvement.x, y: this.selectRectInitialPos.y + this.mouseMouvement.y },
                    this.image,
                );
                this.isAllSelect = false;
                this.mouseMouvement = { x: 0, y: 0 };
            }
        }

        this.mouseDown = false;
        this.inSelection = false;
    }

    drawSelection(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, imagePosition: Vec2): void {
        if (this.isAllSelect) {
            this.drawSelectionRect(ctx, mouseCoord);
            ctx.putImageData(this.imageData, imagePosition.x, imagePosition.y);
        } else {
            ctx.save();
            ctx.beginPath();
            this.drawEllipse(ctx, mouseCoord, this.width / 2, this.height / 2);
            ctx.stroke();
            ctx.clip();
            ctx.drawImage(this.image, imagePosition.x, imagePosition.y);
            ctx.restore();
            this.drawSelectionRect(ctx, mouseCoord);
        }
    }

    pasteSelection(imageposition: Vec2, selectRectInitialPos: Vec2, image: HTMLImageElement): void {
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
            this.drawEllipse(this.drawingService.baseCtx, selectRectInitialPos, this.width / 2, this.height / 2);
            this.drawingService.baseCtx.stroke();
            this.drawingService.baseCtx.clip();
            this.drawingService.baseCtx.globalAlpha = 1;
            this.drawingService.baseCtx.drawImage(image, imageposition.x, imageposition.y);
            this.drawingService.baseCtx.restore();
        }
    }

    drawPreview(): void {
        this.drawPreviewEllipse(this.drawingService.previewCtx);
    }

    drawPreviewEllipse(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDownCoord !== this.mousePosition) {
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            this.drawPreviewRect(ctx, false);
            ctx.beginPath();
            this.drawEllipse(ctx, this.mouseDownCoord, this.width / 2, this.height / 2);
            ctx.stroke();
        }
    }

    drawEllipse(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, radiusX: number, radiusY: number): void {
        let centerX = 0;
        let centerY = 0;
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
            this.clearSelection(this.selectRectInitialPos, this.width, this.height);
            this.pasteSelection(
                { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                { x: this.selectRectInitialPos.x + this.mouseMouvement.x, y: this.selectRectInitialPos.y + this.mouseMouvement.y },
                this.image,
            );
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
