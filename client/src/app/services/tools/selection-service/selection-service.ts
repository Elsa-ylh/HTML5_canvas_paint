import { Injectable } from '@angular/core';
import { ArrowInfo, MOUVEMENTDELAY, PIXELMOUVEMENT } from '@app/classes/arrow-info';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { ImageClipboard } from '@app/classes/image-clipboard';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { interval, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

// The below is justified because the methods are implemented by their children.
// tslint:disable:no-empty
// This file is larger than 350 lines but is entirely used by the methods.
// tslint:disable:max-file-line-count
export class SelectionService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    // initialization of local const
    minTimeMovement: number = 500;
    lineWidth: number = 1;
    private modifSelectSquare: number = 10;
    dottedSpace: number = 10;

    shiftPressed: boolean = false;
    height: number;
    width: number;
    mouseMovement: Vec2 = { x: 0, y: 0 };
    // startingPos: Vec2;
    endingPos: Vec2;

    imageData: ImageData;
    copyImageInitialPos: Vec2 = { x: 0, y: 0 };
    imagePosition: Vec2 = { x: 0, y: 0 };
    inSelection: boolean = false;
    image: HTMLImageElement = new Image();
    isAllSelect: boolean = false;
    ellipseRad: Vec2 = { x: 0, y: 0 };
    previousMousePos: Vec2 = { x: 0, y: 0 };

    // initialization of variables needed for arrow movement
    leftArrow: ArrowInfo = new ArrowInfo({ x: -PIXELMOUVEMENT, y: 0 }, this.drawingService, this);
    rightArrow: ArrowInfo = new ArrowInfo({ x: +PIXELMOUVEMENT, y: 0 }, this.drawingService, this);
    upArrow: ArrowInfo = new ArrowInfo({ x: 0, y: -PIXELMOUVEMENT }, this.drawingService, this);
    downArrow: ArrowInfo = new ArrowInfo({ x: 0, y: +PIXELMOUVEMENT }, this.drawingService, this);
    subscriptionTimer: Subscription;
    time: number = 0;
    timerStarted: boolean = false;

    // bypass clear selection bug
    cleared: boolean = false;

    // initialization clipboard
    controlGroup: ControlGroup;
    clipboard: ImageClipboard = new ImageClipboard();

    // Control points
    controlPointName: ControlPointName = ControlPointName.none;

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // draw selection
            if (
                this.imagePosition.x !== this.endingPos.x &&
                this.imagePosition.y !== this.endingPos.y &&
                !this.inSelection &&
                this.controlPointName === ControlPointName.none
            ) {
                this.endingPos = mousePosition;
                if (!this.shiftPressed) {
                    this.height = this.endingPos.y - this.imagePosition.y;
                    this.width = this.endingPos.x - this.imagePosition.x;
                }

                if (this.width !== 0 && this.height !== 0) {
                    this.copySelection();
                    this.imagePosition = this.copyImageInitialPos = this.updateSelectionPositions();

                    // initialization of controls points
                    this.controlGroup = new ControlGroup(this.drawingService);
                    this.drawSelection(this.imagePosition);
                    this.cleared = false;
                    // ask about that
                }

                // move or scale selection
            } else if (this.inSelection || this.controlPointName !== ControlPointName.none) {
                this.drawSelection(this.imagePosition);
                this.mouseMovement = { x: 0, y: 0 };

                this.controlGroup.resetSelected();
            }
        }
        this.controlPointName = ControlPointName.none;
        this.mouseDown = false;
        this.inSelection = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // move selection
            if (this.inSelection && this.controlPointName === ControlPointName.none) {
                this.mouseMovement.x = mousePosition.x - this.previousMousePos.x;
                this.mouseMovement.y = mousePosition.y - this.previousMousePos.y;
                this.imagePosition = { x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y };
                this.endingPos = { x: this.endingPos.x + this.mouseMovement.x, y: this.endingPos.y + this.mouseMovement.y };

                this.drawSelection(this.imagePosition);
                this.previousMousePos = mousePosition;

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelection(this.copyImageInitialPos, this.width, this.height);
                    this.cleared = true;
                }

                // scale selection
            } else if (this.controlPointName !== ControlPointName.none) {
                this.mouseMovement.x = mousePosition.x - this.previousMousePos.x;
                this.mouseMovement.y = mousePosition.y - this.previousMousePos.y;

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelection(this.copyImageInitialPos, this.width, this.height);
                    this.cleared = true;
                }

                this.scaleSelection(this.mouseMovement);
                this.drawSelection(this.imagePosition);
                this.previousMousePos = mousePosition;
                console.log(this.height);
                // draw selection
            } else {
                this.endingPos = mousePosition;
                this.drawPreview();
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {}

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown && this.inSelection) {
            this.drawingService.baseCtx.putImageData(this.imageData, this.copyImageInitialPos.x, this.copyImageInitialPos.y);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else {
            this.onMouseUp(event);
        }

        this.mouseDown = false;
    }

    onShiftKeyDown(event: KeyboardEvent): void {
        this.shiftPressed = true;
        if (this.mouseDown && !this.inSelection && this.controlPointName === ControlPointName.none) {
            this.ellipseRad = {
                x: Math.min(Math.abs(this.width / 2), Math.abs(this.height / 2)),
                y: Math.min(Math.abs(this.width / 2), Math.abs(this.height / 2)),
            };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreview();
        }
    }

    onShiftKeyUp(event: KeyboardEvent): void {
        this.shiftPressed = false;
        if (this.mouseDown && !this.inSelection && this.controlPointName === ControlPointName.none) {
            this.ellipseRad = { x: Math.abs(this.width / 2), y: Math.abs(this.height / 2) };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreview();
        }
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = '#000000';
        this.drawingService.previewCtx.strokeStyle = '#000000';
        this.drawingService.baseCtx.lineJoin = 'miter';
        this.drawingService.baseCtx.lineCap = 'square';
        this.drawingService.previewCtx.lineJoin = 'miter';
        this.drawingService.previewCtx.lineCap = 'square';
    }

    selectAll(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.isAllSelect = true;
        this.width = this.drawingService.canvas.width;
        this.height = this.drawingService.canvas.height;
        this.endingPos = { x: this.width, y: this.height };
        this.imagePosition = this.copyImageInitialPos = { x: 1, y: 1 };
        this.imageData = this.drawingService.baseCtx.getImageData(0, 0, this.width, this.height);
        this.drawSelection({ x: 0, y: 0 });
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, shiftPressed: boolean): void {
        if (this.imagePosition !== this.endingPos) {
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            if (shiftPressed) {
                const distanceX = this.endingPos.x - this.imagePosition.x;
                const distanceY = this.endingPos.y - this.imagePosition.y;
                // calculate width and height while keeping sign
                this.height = Math.sign(distanceY) * Math.min(Math.abs(distanceX), Math.abs(distanceY));
                this.width = Math.sign(distanceX) * Math.min(Math.abs(distanceX), Math.abs(distanceY));
            } else {
                this.height = this.endingPos.y - this.imagePosition.y;
                this.width = this.endingPos.x - this.imagePosition.x;
            }
            ctx.strokeRect(this.imagePosition.x, this.imagePosition.y, this.width, this.height);
        }
    }

    drawSelectionRect(mouseDownCoord: Vec2, width: number, height: number): void {
        this.drawingService.previewCtx.setLineDash([this.dottedSpace, this.dottedSpace]);
        this.drawingService.previewCtx.strokeRect(mouseDownCoord.x, mouseDownCoord.y, width, height);
        this.drawingService.previewCtx.setLineDash([]);
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x + width / 2 - this.modifSelectSquare / 2,
            mouseDownCoord.y - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );

        this.controlGroup.setPositions(this.imagePosition, this.endingPos, { x: this.width, y: this.height });

        this.controlGroup.draw();
    }

    copySelection(): void {
        this.imageData = this.drawingService.baseCtx.getImageData(this.imagePosition.x, this.imagePosition.y, this.width, this.height);
        this.image.src = this.getImageURL(this.imageData, this.width, this.height);
    }

    updateSelectionPositions(): Vec2 {
        const xSign = Math.sign(this.endingPos.x - this.imagePosition.x);
        const ySign = Math.sign(this.endingPos.y - this.imagePosition.y);
        const tmpEndPos = this.endingPos;

        this.width = Math.abs(this.width);
        this.height = Math.abs(this.height);

        if (xSign > 0 && ySign > 0) {
            return { x: this.imagePosition.x, y: this.imagePosition.y };
        } else if (xSign > 0 && ySign < 0) {
            this.endingPos = { x: this.endingPos.x, y: this.imagePosition.y };
            return { x: this.imagePosition.x, y: tmpEndPos.y };
        } else if (xSign < 0 && ySign < 0) {
            this.endingPos = { x: this.imagePosition.x, y: this.imagePosition.y };
            return { x: tmpEndPos.x, y: tmpEndPos.y };
        } else {
            this.endingPos = { x: this.imagePosition.x, y: this.endingPos.y };
            return { x: tmpEndPos.x, y: this.imagePosition.y };
        }
    }

    isInsideSelection(mouse: Vec2): boolean {
        if (
            this.imagePosition.x !== 0 &&
            this.imagePosition.x !== 0 &&
            this.endingPos.x !== 0 &&
            this.endingPos.y !== 0 &&
            !this.drawingService.isPreviewCanvasBlank()
        ) {
            const minX = Math.min(this.endingPos.x, this.imagePosition.x);
            const maxX = Math.max(this.endingPos.x, this.imagePosition.x);
            const minY = Math.min(this.endingPos.y, this.imagePosition.y);
            const maxY = Math.max(this.endingPos.y, this.imagePosition.y);

            if (mouse.x > minX && mouse.x < maxX && mouse.y > minY && mouse.y < maxY) {
                return true;
            }
        }
        return false;
    }

    protected drawPreview(): void {}

    drawSelection(imagePosition: Vec2): void {}

    getImageURL(imgData: ImageData, width: number, height: number): string {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const ctx = (canvas.getContext('2d') as CanvasRenderingContext2D) as CanvasRenderingContext2D;
        canvas.width = Math.abs(width);
        canvas.height = Math.abs(height);
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }

    clearSelection(position: Vec2, width: number, height: number): void {}

    onLeftArrow(): void {
        this.leftArrow.onArrowDown();
    }

    onRightArrow(): void {
        this.rightArrow.onArrowDown();
    }

    onUpArrow(): void {
        this.upArrow.onArrowDown();
    }

    onDownArrow(): void {
        this.downArrow.onArrowDown();
    }

    onLeftArrowUp(): void {
        this.leftArrow.onArrowUp();
    }

    onRightArrowUp(): void {
        this.rightArrow.onArrowUp();
    }

    onDownArrowUp(): void {
        this.downArrow.onArrowUp();
    }

    onUpArrowUp(): void {
        this.upArrow.onArrowUp();
    }

    startTimer(): void {
        if (!this.timerStarted) {
            this.timerStarted = true;
            const mainTimer = interval(MOUVEMENTDELAY);
            this.subscriptionTimer = mainTimer.subscribe(() => (this.time += MOUVEMENTDELAY));
        }
    }

    resetTimer(): void {
        if (
            !this.upArrow.arrowPressed &&
            !this.downArrow.arrowPressed &&
            !this.leftArrow.arrowPressed &&
            !this.rightArrow.arrowPressed &&
            this.timerStarted
        ) {
            this.subscriptionTimer.unsubscribe();
            this.timerStarted = false;
            this.time = 0;
        }
    }

    copyImage(): void {
        this.clipboard.imageData = this.imageData;
        this.clipboard.image = new Image();
        this.clipboard.image.src = this.getImageURL(this.clipboard.imageData, this.width, this.height);
        this.clipboard.imagePosition = this.imagePosition;
        this.clipboard.width = this.width;
        this.clipboard.height = this.height;
        this.clipboard.ellipseRad = { x: this.ellipseRad.x, y: this.ellipseRad.y };
        this.clipboard.end = this.endingPos;
    }

    cutImage(): void {
        if (!this.cleared) {
            this.clearSelection(this.copyImageInitialPos, this.width, this.height);
            this.cleared = true;
        }

        this.copyImage();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    deleteImage(): void {
        this.clearSelection(this.copyImageInitialPos, this.width, this.height);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    pasteImage(): void {}

    // tslint:disable:cyclomatic-complexity
    scaleSelection(mouseMovement: Vec2): void {
        if (!this.shiftPressed) {
            switch (this.controlPointName) {
                case ControlPointName.top:
                    this.height -= mouseMovement.y;
                    this.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.bottom:
                    this.height += mouseMovement.y;
                    this.endingPos.y += mouseMovement.y;
                    break;
                case ControlPointName.left:
                    this.width -= mouseMovement.x;
                    this.imagePosition.x += mouseMovement.x;
                    break;
                case ControlPointName.right:
                    this.width += mouseMovement.x;
                    this.endingPos.x += mouseMovement.x;
                    break;
                case ControlPointName.topLeft:
                    this.width -= mouseMovement.x;
                    this.height -= mouseMovement.y;
                    this.imagePosition.x += mouseMovement.x;
                    this.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.topRight:
                    this.width += mouseMovement.x;
                    this.height -= mouseMovement.y;
                    this.endingPos.x += mouseMovement.x;
                    this.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.bottomLeft:
                    this.width -= mouseMovement.x;
                    this.height += mouseMovement.y;
                    this.imagePosition.x += mouseMovement.x;
                    this.endingPos.y += mouseMovement.y;
                    break;
                case ControlPointName.bottomRight:
                    this.width += mouseMovement.x;
                    this.height += mouseMovement.y;
                    this.endingPos.x += mouseMovement.x;
                    this.endingPos.y += mouseMovement.y;
                    break;
            }
        } else {
            switch (this.controlPointName) {
                case ControlPointName.top:
                    this.height -= mouseMovement.y * 2;
                    this.imagePosition.y += mouseMovement.y;
                    this.endingPos.y -= mouseMovement.y;
                    break;
                case ControlPointName.bottom:
                    this.height += mouseMovement.y * 2;
                    this.endingPos.y += mouseMovement.y;
                    this.imagePosition.y -= mouseMovement.y;
                    break;
                case ControlPointName.left:
                    this.width -= mouseMovement.x * 2;
                    this.imagePosition.x += mouseMovement.x;
                    this.endingPos.x -= mouseMovement.x;
                    break;
                case ControlPointName.right:
                    this.width += mouseMovement.x * 2;
                    this.endingPos.x += mouseMovement.x;
                    this.imagePosition.x -= mouseMovement.x;
                    break;
                case ControlPointName.topLeft:
                    this.width -= mouseMovement.x * 2;
                    this.height -= mouseMovement.y * 2;
                    this.imagePosition.x += mouseMovement.x;
                    this.imagePosition.y += mouseMovement.y;
                    this.endingPos.x -= mouseMovement.x;
                    this.endingPos.y -= mouseMovement.y;
                    break;
                case ControlPointName.topRight:
                    this.width += mouseMovement.x * 2;
                    this.height -= mouseMovement.y * 2;
                    this.endingPos.x += mouseMovement.x;
                    this.imagePosition.y += mouseMovement.y;
                    this.endingPos.y -= mouseMovement.y;
                    this.imagePosition.x -= mouseMovement.x;
                    break;
                case ControlPointName.bottomLeft:
                    this.width -= mouseMovement.x * 2;
                    this.height += mouseMovement.y * 2;
                    this.imagePosition.x += mouseMovement.x;
                    this.endingPos.y += mouseMovement.y;
                    this.imagePosition.y -= mouseMovement.y;
                    this.endingPos.x -= mouseMovement.x;
                    break;
                case ControlPointName.bottomRight:
                    this.width += mouseMovement.x * 2;
                    this.height += mouseMovement.y * 2;
                    this.endingPos.x += mouseMovement.x;
                    this.endingPos.y += mouseMovement.y;
                    this.imagePosition.x -= mouseMovement.x;
                    this.imagePosition.y -= mouseMovement.y;
                    break;
            }
        }
    }
}
