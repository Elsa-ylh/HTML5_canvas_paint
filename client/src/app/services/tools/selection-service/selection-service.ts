import { Injectable } from '@angular/core';
import { ArrowInfo, MOVEMENTDELAY, PIXELMOVEMENT } from '@app/classes/arrow-info';
import { ControlPoint } from '@app/classes/control-points';
import { ImageClipboard } from '@app/classes/image-clipboard';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { interval, Subscription, timer } from 'rxjs';

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
    private minTimeMovement: number = 500;
    lineWidth: number = 1;
    private modifySelectSquare: number = 10;
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
    leftArrow: ArrowInfo = new ArrowInfo();
    rightArrow: ArrowInfo = new ArrowInfo();
    upArrow: ArrowInfo = new ArrowInfo();
    downArrow: ArrowInfo = new ArrowInfo();
    subscriptionTimer: Subscription;
    time: number = 0;
    timerStarted: boolean = false;

    // bypass clear selection bug
    cleared: boolean = false;

    // initialization clipboard
    clipboard: ImageClipboard = new ImageClipboard();

    // Control points
    controlPoint: ControlPoint = ControlPoint.none;

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
                this.controlPoint === ControlPoint.none
            ) {
                this.endingPos = mousePosition;
                if (!this.shiftPressed) {
                    this.height = this.endingPos.y - this.imagePosition.y;
                    this.width = this.endingPos.x - this.imagePosition.x;
                }

                if (this.width !== 0 && this.height !== 0) {
                    this.copySelection();
                    this.imagePosition = this.copyImageInitialPos = this.updateSelectionPositions();
                    this.width = Math.abs(this.width);
                    this.height = Math.abs(this.height);
                    // this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                    this.drawSelection(this.copyImageInitialPos);

                    this.cleared = false;
                    // ask about that
                    // this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                }

                // move selection
            } else if (this.inSelection && this.controlPoint === ControlPoint.none) {
                this.imagePosition = { x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y };
                this.drawSelection(this.imagePosition);
                // this.startingPos = { x: this.startingPos.x + this.mouseMovement.x, y: this.startingPos.y + this.mouseMovement.y };
                this.endingPos = { x: this.endingPos.x + this.mouseMovement.x, y: this.endingPos.y + this.mouseMovement.y };
                this.mouseMovement = { x: 0, y: 0 };
            } else if (this.controlPoint !== ControlPoint.none) {
                this.drawSelection(this.imagePosition);
            }
        }
        this.controlPoint = ControlPoint.none;
        this.mouseDown = false;
        this.inSelection = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // move selection
            if (this.inSelection && this.controlPoint === ControlPoint.none) {
                this.mouseMovement.x = mousePosition.x - this.mouseDownCoords.x;
                this.mouseMovement.y = mousePosition.y - this.mouseDownCoords.y;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                    this.cleared = true;
                }

                // scale selection
            } else if (this.controlPoint !== ControlPoint.none) {
                this.mouseMovement.x = mousePosition.x - this.previousMousePos.x;
                this.mouseMovement.y = mousePosition.y - this.previousMousePos.y;
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
        if (this.mouseDown && !this.inSelection) {
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
        if (this.mouseDown && !this.inSelection) {
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
        // this.startingPos = { x: 1, y: 1 };
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

    drawSelectionRect(mouseDownCoords: Vec2, width: number, height: number): void {
        this.drawingService.previewCtx.strokeRect(mouseDownCoords.x, mouseDownCoords.y, width, height);
        this.drawingService.previewCtx.setLineDash([]);
        this.drawingService.previewCtx.fillRect(
            mouseDownCoords.x + width / 2 - this.modifySelectSquare / 2,
            mouseDownCoords.y - this.modifySelectSquare / 2,
            this.modifySelectSquare,
            this.modifySelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoords.x - this.modifySelectSquare / 2,
            mouseDownCoords.y + height / 2 - this.modifySelectSquare / 2,
            this.modifySelectSquare,
            this.modifySelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoords.x + width / 2 - this.modifySelectSquare / 2,
            mouseDownCoords.y + height - this.modifySelectSquare / 2,
            this.modifySelectSquare,
            this.modifySelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoords.x + width - this.modifySelectSquare / 2,
            mouseDownCoords.y + height / 2 - this.modifySelectSquare / 2,
            this.modifySelectSquare,
            this.modifySelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoords.x - this.modifySelectSquare / 2,
            mouseDownCoords.y - this.modifySelectSquare / 2,
            this.modifySelectSquare,
            this.modifySelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoords.x + width - this.modifySelectSquare / 2,
            mouseDownCoords.y - this.modifySelectSquare / 2,
            this.modifySelectSquare,
            this.modifySelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoords.x - this.modifySelectSquare / 2,
            mouseDownCoords.y + height - this.modifySelectSquare / 2,
            this.modifySelectSquare,
            this.modifySelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoords.x + width - this.modifySelectSquare / 2,
            mouseDownCoords.y + height - this.modifySelectSquare / 2,
            this.modifySelectSquare,
            this.modifySelectSquare,
        );
        this.drawingService.previewCtx.setLineDash([this.dottedSpace, this.dottedSpace]);
    }

    copySelection(): void {
        this.imageData = this.drawingService.baseCtx.getImageData(this.imagePosition.x, this.imagePosition.y, this.width, this.height);
        this.image.src = this.getImageURL(this.imageData, this.width, this.height);
    }

    updateSelectionPositions(): Vec2 {
        const xSign = Math.sign(this.endingPos.x - this.imagePosition.x);
        const ySign = Math.sign(this.endingPos.y - this.imagePosition.y);
        const tmpEndPos = this.endingPos;

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

    protected drawSelection(imagePosition: Vec2): void {}

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
        if (!this.drawingService.isPreviewCanvasBlank()) {
            if (!this.cleared) {
                this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                this.cleared = true;
            }
            if (!this.leftArrow.arrowPressed) {
                // first movement
                this.mouseMovement.x -= PIXELMOVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            }
            this.leftArrow.arrowPressed = true;
            this.startTimer();
            // for continuous movement
            if (this.time >= this.minTimeMovement) {
                this.moveSelectionTimerLeft();
            }
        }
    }

    onRightArrow(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            if (!this.cleared) {
                this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                this.cleared = true;
            }
            if (!this.rightArrow.arrowPressed) {
                // first movement
                this.mouseMovement.x += PIXELMOVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            }
            this.rightArrow.arrowPressed = true;
            this.startTimer();
            // for continuous movement
            if (this.time >= this.minTimeMovement) {
                this.moveSelectionTimerRight();
            }
        }
    }

    onUpArrow(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            if (!this.cleared) {
                this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                this.cleared = true;
            }
            if (!this.upArrow.arrowPressed) {
                // first movement
                this.mouseMovement.y -= PIXELMOVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            }
            this.upArrow.arrowPressed = true;
            this.startTimer();
            // for continuous movement
            if (this.time >= this.minTimeMovement) {
                this.moveSelectionTimerUp();
            }
        }
    }

    onDownArrow(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            if (!this.cleared) {
                this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                this.cleared = true;
            }
            if (!this.downArrow.arrowPressed) {
                // first mouvement
                this.mouseMovement.y += PIXELMOVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            }
            this.downArrow.arrowPressed = true;
            this.startTimer();
            // for continuous movement
            if (this.time >= this.minTimeMovement) {
                this.moveSelectionTimerDown();
            }
        }
    }

    onLeftArrowUp(): void {}

    onRightArrowUp(): void {}

    onDownArrowUp(): void {}

    onUpArrowUp(): void {}

    startTimer(): void {
        if (!this.timerStarted) {
            this.timerStarted = true;
            const mainTimer = interval(MOVEMENTDELAY);
            this.subscriptionTimer = mainTimer.subscribe(() => (this.time += MOVEMENTDELAY));
        }
    }

    moveSelectionTimerLeft(): void {
        if (!this.leftArrow.timerStarted) {
            this.leftArrow.timerStarted = true;
            const timerMove = timer(MOVEMENTDELAY, MOVEMENTDELAY);

            this.leftArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMovement.x -= PIXELMOVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            });
        }
    }

    moveSelectionTimerRight(): void {
        if (!this.rightArrow.timerStarted) {
            this.rightArrow.timerStarted = true;
            const timerMove = timer(MOVEMENTDELAY, MOVEMENTDELAY);

            this.rightArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMovement.x += PIXELMOVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            });
        }
    }

    moveSelectionTimerUp(): void {
        if (!this.upArrow.timerStarted) {
            this.upArrow.timerStarted = true;
            const timerMove = timer(MOVEMENTDELAY, MOVEMENTDELAY);

            this.upArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMovement.y -= PIXELMOVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            });
        }
    }

    moveSelectionTimerDown(): void {
        if (!this.downArrow.timerStarted) {
            this.downArrow.timerStarted = true;
            const timerMove = timer(MOVEMENTDELAY, MOVEMENTDELAY);

            this.downArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMovement.y += PIXELMOVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            });
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
        this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
        this.copyImage();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    deleteImage(): void {
        this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    pasteImage(): void {}

    // tslint:disable:cyclomatic-complexity
    isInControlPoint(mouse: Vec2): ControlPoint {
        if (
            mouse.x >= this.imagePosition.x - this.modifySelectSquare / 2 &&
            mouse.x <= this.imagePosition.x + this.modifySelectSquare / 2 &&
            mouse.y >= this.imagePosition.y - this.modifySelectSquare / 2 &&
            mouse.y <= this.imagePosition.y + this.modifySelectSquare / 2
        ) {
            return ControlPoint.topLeft;
        }
        if (
            mouse.x >= this.imagePosition.x + this.width / 2 - this.modifySelectSquare / 2 &&
            mouse.x <= this.imagePosition.x + this.width / 2 + this.modifySelectSquare / 2 &&
            mouse.y >= this.imagePosition.y - this.modifySelectSquare / 2 &&
            mouse.y <= this.imagePosition.y + this.modifySelectSquare / 2
        ) {
            return ControlPoint.top;
        }
        if (
            mouse.x >= this.imagePosition.x + this.width - this.modifySelectSquare / 2 &&
            mouse.x <= this.imagePosition.x + this.width + this.modifySelectSquare / 2 &&
            mouse.y >= this.imagePosition.y - this.modifySelectSquare / 2 &&
            mouse.y <= this.imagePosition.y + this.modifySelectSquare / 2
        ) {
            return ControlPoint.topRight;
        }
        if (
            mouse.x >= this.endingPos.x - this.modifySelectSquare / 2 &&
            mouse.x <= this.endingPos.x + this.modifySelectSquare / 2 &&
            mouse.y >= this.endingPos.y - this.modifySelectSquare / 2 &&
            mouse.y <= this.endingPos.y + this.modifySelectSquare / 2
        ) {
            return ControlPoint.bottomRight;
        }
        if (
            mouse.x >= this.endingPos.x - this.width / 2 - this.modifySelectSquare / 2 &&
            mouse.x <= this.endingPos.x - this.width / 2 + this.modifySelectSquare / 2 &&
            mouse.y >= this.endingPos.y - this.modifySelectSquare / 2 &&
            mouse.y <= this.endingPos.y + this.modifySelectSquare / 2
        ) {
            return ControlPoint.bottom;
        }
        if (
            mouse.x >= this.endingPos.x - this.width - this.modifySelectSquare / 2 &&
            mouse.x <= this.endingPos.x - this.width + this.modifySelectSquare / 2 &&
            mouse.y >= this.endingPos.y - this.modifySelectSquare / 2 &&
            mouse.y <= this.endingPos.y + this.modifySelectSquare / 2
        ) {
            return ControlPoint.bottomLeft;
        }
        if (
            mouse.x >= this.imagePosition.x - this.modifySelectSquare / 2 &&
            mouse.x <= this.imagePosition.x + this.modifySelectSquare / 2 &&
            mouse.y >= this.imagePosition.y + this.height / 2 - this.modifySelectSquare / 2 &&
            mouse.y <= this.imagePosition.y + this.height / 2 + this.modifySelectSquare / 2
        ) {
            return ControlPoint.left;
        }
        if (
            mouse.x >= this.endingPos.x - this.modifySelectSquare / 2 &&
            mouse.x <= this.endingPos.x + this.modifySelectSquare / 2 &&
            mouse.y >= this.endingPos.y - this.height / 2 - this.modifySelectSquare / 2 &&
            mouse.y <= this.endingPos.y - this.height / 2 + this.modifySelectSquare / 2
        ) {
            return ControlPoint.right;
            // }else if(this.inSelection){
            //   return ControlPoint.center;
        } else {
            return ControlPoint.none;
        }
    }

    scaleSelection(mouseMovement: Vec2): void {
        switch (this.controlPoint) {
            case ControlPoint.top:
                this.height -= mouseMovement.y;
                this.imagePosition.y += mouseMovement.y;
                break;
            case ControlPoint.bottom:
                this.height += mouseMovement.y;
                this.endingPos.y += mouseMovement.y;
                break;
            case ControlPoint.left:
                this.width -= mouseMovement.x;
                this.imagePosition.x += mouseMovement.x;
                break;
            case ControlPoint.right:
                this.width += mouseMovement.x;
                this.endingPos.x += mouseMovement.x;
                break;
            case ControlPoint.topLeft:
                this.width -= mouseMovement.x;
                this.height -= mouseMovement.y;
                this.imagePosition.x += mouseMovement.x;
                this.imagePosition.y += mouseMovement.y;
                break;
            case ControlPoint.topRight:
                this.width += mouseMovement.x;
                this.height -= mouseMovement.y;
                this.endingPos.x += mouseMovement.x;
                this.imagePosition.y += mouseMovement.y;
                break;
            case ControlPoint.bottomLeft:
                this.width -= mouseMovement.x;
                this.height += mouseMovement.y;
                this.imagePosition.x += mouseMovement.x;
                this.endingPos.y += mouseMovement.y;
                break;
            case ControlPoint.bottomRight:
                this.width += mouseMovement.x;
                this.height += mouseMovement.y;
                this.endingPos.x += mouseMovement.x;
                this.endingPos.y += mouseMovement.y;
                break;
        }
    }
}
