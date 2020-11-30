import { Injectable } from '@angular/core';
import { ArrowInfo, MOVEMENTDELAY, PIXELMOVEMENT } from '@app/classes/arrow-info';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { FlipDirection } from '@app/classes/flip-direction';
import { ImageClipboard } from '@app/classes/image-clipboard';
import { SelectionImage } from '@app/classes/selection';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismParams, MagnetismService } from '@app/services/tools/magnetism.service';
import { interval, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
// , private undoRedoService: UndoRedoService
// The below is justified because the methods are implemented by their children.
// tslint:disable:no-empty
// This file is larger than 350 lines but is entirely used by the methods.
// tslint:disable:max-file-line-count
export class SelectionService extends Tool {
    constructor(drawingService: DrawingService, protected magnetismService: MagnetismService) {
        super(drawingService);
    }

    // initialization of local const
    minTimeMovement: number = 500;
    lineWidth: number = 1;
    dottedSpace: number = 10;
    shiftPressed: boolean = false;
    scaled: boolean = false;

    baseImage: HTMLImageElement;
    baseImageData: ImageData;
    // height: number;
    // width: number;
    mouseMovement: Vec2 = { x: 0, y: 0 };
    // startingPos: Vec2;
    // endingPos: Vec2;

    // selection
    selection: SelectionImage = new SelectionImage(this.drawingService);
    // = new SelectionImage({ x: 0, y: 0 }, 0, 0, { x: 0, y: 0 }, this.drawingService);

    // imageData: ImageData;
    // copyImageInitialPos: Vec2 = { x: 0, y: 0 };
    // imagePosition: Vec2 = { x: 0, y: 0 };
    inSelection: boolean = false;
    // image: HTMLImageElement = new Image();
    isAllSelect: boolean = false;
    // ellipseRad: Vec2 = { x: 0, y: 0 };
    previousMousePos: Vec2 = { x: 0, y: 0 };

    // initialization of variables needed for arrow movement
    leftArrow: ArrowInfo = new ArrowInfo({ x: -PIXELMOVEMENT, y: 0 }, this.drawingService, this, this.magnetismService);
    rightArrow: ArrowInfo = new ArrowInfo({ x: +PIXELMOVEMENT, y: 0 }, this.drawingService, this, this.magnetismService);
    upArrow: ArrowInfo = new ArrowInfo({ x: 0, y: -PIXELMOVEMENT }, this.drawingService, this, this.magnetismService);
    downArrow: ArrowInfo = new ArrowInfo({ x: 0, y: +PIXELMOVEMENT }, this.drawingService, this, this.magnetismService);
    subscriptionTimer: Subscription;
    time: number = 0;
    timerStarted: boolean = false;

    // bypass clear selection bug
    cleared: boolean = false;

    // initialization clipboard
    clipboard: ImageClipboard = new ImageClipboard();

    // Control points
    controlGroup: ControlGroup;
    controlPointName: ControlPointName = ControlPointName.none;
    flip: FlipDirection = FlipDirection.none;

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // draw selection
            if (
                this.selection.imagePosition.x !== this.selection.endingPos.x &&
                this.selection.imagePosition.y !== this.selection.endingPos.y &&
                !this.inSelection &&
                this.controlPointName === ControlPointName.none
            ) {
                this.selection.endingPos = mousePosition;
                if (!this.shiftPressed) {
                    this.selection.height = this.selection.endingPos.y - this.selection.imagePosition.y;
                    this.selection.width = this.selection.endingPos.x - this.selection.imagePosition.x;
                }

                if (this.selection.width !== 0 && this.selection.height !== 0) {
                    this.copySelection();
                    this.selection.imageSize = { x: this.selection.width, y: this.selection.height };
                    this.selection.imagePosition = this.selection.copyImageInitialPos = this.updateSelectionPositions();

                    // initialization of controls points
                    this.controlGroup = new ControlGroup(this.drawingService);
                    this.drawSelection(this.selection.imagePosition);
                    this.cleared = false;
                    // ask about that
                }

                this.magnetismService.resetMagnetism();

                // move or scale selection
            } else if (this.inSelection || this.controlPointName !== ControlPointName.none) {
                this.drawSelection(this.selection.imagePosition);
                this.mouseMovement = { x: 0, y: 0 };
                this.selection.imagePosition = this.updateSelectionPositions();

                // reset baseImage to use when flipping the image
                this.baseImage = new Image();
                this.baseImage.src = this.selection.image.src;
                // not in action anymore
                // this.controlGroup.resetSelected();
            }
        }
        // this.controlPointName = ControlPointName.none;
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
                this.selection.imagePosition = {
                    x: this.selection.imagePosition.x + this.mouseMovement.x,
                    y: this.selection.imagePosition.y + this.mouseMovement.y,
                };
                this.selection.endingPos = {
                    x: this.selection.endingPos.x + this.mouseMovement.x,
                    y: this.selection.endingPos.y + this.mouseMovement.y,
                };

                // press "m" to activate the magnetism and sure there is a controlPointName selected
                // this controlPointName is different from the one in selection service, as one if for resizing purpose
                // and the following for the magnetism
                if (this.controlGroup.controlPointName !== ControlPointName.none) {
                    const magnetismReturn = this.magnetismService.applyMagnetismMouseMove({
                        imagePosition: this.selection.imagePosition,
                        endingPosition: this.selection.endingPos,
                        controlGroup: this.controlGroup,
                        selectionSize: { x: this.selection.width, y: this.selection.height } as Vec2,
                    } as MagnetismParams);

                    this.selection.imagePosition = magnetismReturn.imagePosition;
                    this.selection.endingPos = magnetismReturn.endingPosition;
                    this.controlGroup = magnetismReturn.controlGroup;
                }
                this.drawSelection(this.selection.imagePosition);

                this.previousMousePos = mousePosition;

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelection(this.selection.copyImageInitialPos, this.selection.width, this.selection.height);
                    this.cleared = true;
                }

                // scale selection
            } else if (this.controlPointName !== ControlPointName.none) {
                this.mouseMovement.x = mousePosition.x - this.previousMousePos.x;
                this.mouseMovement.y = mousePosition.y - this.previousMousePos.y;

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelection(this.selection.copyImageInitialPos, this.selection.width, this.selection.height);
                    this.cleared = true;
                }

                this.scaleSelection(this.mouseMovement);
                this.drawSelection(this.selection.imagePosition);
                this.previousMousePos = mousePosition;
                // draw selection
            } else {
                this.selection.endingPos = mousePosition;
                this.drawPreview();
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {}

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown && this.inSelection) {
            this.drawingService.baseCtx.putImageData(
                this.selection.imageData,
                this.selection.copyImageInitialPos.x,
                this.selection.copyImageInitialPos.y,
            );
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else {
            this.onMouseUp(event);
        }

        this.mouseDown = false;
    }

    onShiftKeyDown(event: KeyboardEvent): void {
        this.shiftPressed = true;
        if (this.mouseDown && !this.inSelection && this.controlPointName === ControlPointName.none) {
            this.selection.ellipseRad = {
                x: Math.min(Math.abs(this.selection.width / 2), Math.abs(this.selection.height / 2)),
                y: Math.min(Math.abs(this.selection.width / 2), Math.abs(this.selection.height / 2)),
            };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreview();
        }
    }

    onShiftKeyUp(event: KeyboardEvent): void {
        this.shiftPressed = false;
        if (this.mouseDown && !this.inSelection && this.controlPointName === ControlPointName.none) {
            this.selection.ellipseRad = { x: Math.abs(this.selection.width / 2), y: Math.abs(this.selection.height / 2) };
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
        this.selection.width = this.drawingService.canvas.width;
        this.selection.height = this.drawingService.canvas.height;
        this.selection.endingPos = { x: this.selection.width, y: this.selection.height };
        this.selection.imagePosition = this.selection.copyImageInitialPos = { x: 1, y: 1 };
        this.selection.imageData = this.drawingService.baseCtx.getImageData(0, 0, this.selection.width, this.selection.height);
        this.drawSelection({ x: 0, y: 0 });
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, shiftPressed: boolean): void {
        if (this.selection.imagePosition !== this.selection.endingPos) {
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            if (shiftPressed) {
                const distanceX = this.selection.endingPos.x - this.selection.imagePosition.x;
                const distanceY = this.selection.endingPos.y - this.selection.imagePosition.y;
                // calculate width and height while keeping sign
                this.selection.height = Math.sign(distanceY) * Math.min(Math.abs(distanceX), Math.abs(distanceY));
                this.selection.width = Math.sign(distanceX) * Math.min(Math.abs(distanceX), Math.abs(distanceY));
            } else {
                this.selection.height = this.selection.endingPos.y - this.selection.imagePosition.y;
                this.selection.width = this.selection.endingPos.x - this.selection.imagePosition.x;
            }
            ctx.strokeRect(this.selection.imagePosition.x, this.selection.imagePosition.y, this.selection.width, this.selection.height);
        }
    }

    drawSelectionRect(mouseDownCoords: Vec2, width: number, height: number): void {
        this.drawingService.previewCtx.setLineDash([this.dottedSpace, this.dottedSpace]);
        this.drawingService.previewCtx.strokeRect(mouseDownCoords.x, mouseDownCoords.y, width, height);
        this.drawingService.previewCtx.setLineDash([]);

        this.controlGroup.setPositions(this.selection.imagePosition, this.selection.endingPos, { x: this.selection.width, y: this.selection.height });

        this.controlGroup.draw();
    }

    copySelection(): void {
        this.selection.getImage({ x: this.selection.width, y: this.selection.height });
        this.baseImageData = this.selection.imageData;
        this.baseImage = new Image();
        this.baseImage.src = this.getImageURL(this.baseImageData, this.selection.width, this.selection.height);
        // this.selection.imageData = this.drawingService.baseCtx.getImageData(this.selection.imagePosition.x,
        // this.selection.imagePosition.y, this.selection.width, this.selection.height);
        // this.selection.image.src = this.getImageURL(this.selection.imageData, this.selection.width, this.selection.height);
    }

    pasteSelection(selection: SelectionImage): void {}

    updateSelectionPositions(): Vec2 {
        const xSign = Math.sign(this.selection.endingPos.x - this.selection.imagePosition.x);
        const ySign = Math.sign(this.selection.endingPos.y - this.selection.imagePosition.y);
        const tmpEndPos = this.selection.endingPos;

        this.selection.width = Math.abs(this.selection.width);
        this.selection.height = Math.abs(this.selection.height);

        if (xSign > 0 && ySign > 0) {
            return { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
        } else if (xSign > 0 && ySign < 0) {
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

    isInsideSelection(mouse: Vec2): boolean {
        if (
            this.selection.imagePosition.x !== 0 &&
            this.selection.imagePosition.x !== 0 &&
            this.selection.endingPos.x !== 0 &&
            this.selection.endingPos.y !== 0 &&
            !this.drawingService.isPreviewCanvasBlank()
        ) {
            const minX = Math.min(this.selection.endingPos.x, this.selection.imagePosition.x);
            const maxX = Math.max(this.selection.endingPos.x, this.selection.imagePosition.x);
            const minY = Math.min(this.selection.endingPos.y, this.selection.imagePosition.y);
            const maxY = Math.max(this.selection.endingPos.y, this.selection.imagePosition.y);

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
        this.leftArrow.onArrowDown(this.controlGroup);
    }

    onRightArrow(): void {
        this.rightArrow.onArrowDown(this.controlGroup);
    }

    onUpArrow(): void {
        this.upArrow.onArrowDown(this.controlGroup);
    }

    onDownArrow(): void {
        this.downArrow.onArrowDown(this.controlGroup);
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
            const mainTimer = interval(MOVEMENTDELAY);
            this.subscriptionTimer = mainTimer.subscribe(() => (this.time += MOVEMENTDELAY));
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
        // this.clipboard.copyImage(this.selection);
        this.clipboard.imageData = this.selection.imageData;
        this.clipboard.image = new Image();
        this.clipboard.image.src = this.getImageURL(this.clipboard.imageData, this.selection.imageSize.x, this.selection.imageSize.y);
        this.clipboard.imagePosition = this.selection.imagePosition;
        this.clipboard.width = this.selection.width;
        this.clipboard.height = this.selection.height;
        this.clipboard.ellipseRad = { x: this.selection.ellipseRad.x, y: this.selection.ellipseRad.y };
        this.clipboard.imageSize = { x: this.selection.imageSize.x, y: this.selection.imageSize.y };
        this.clipboard.end = this.selection.endingPos;
    }

    cutImage(): void {
        // this.clipboard.cutImage();
        if (!this.cleared) {
            this.clearSelection(this.selection.copyImageInitialPos, this.selection.width, this.selection.height);
            this.cleared = true;
        }

        this.copyImage();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    deleteImage(): void {
        // this.clipboard.deleteImage();
        this.clearSelection(this.selection.copyImageInitialPos, this.selection.width, this.selection.height);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    pasteImage(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.pasteSelection(this.selection);
        }
        this.cleared = true;
        this.selection.imageData = this.clipboard.imageData;
        this.selection.imagePosition = { x: 1, y: 1 };
        this.selection.width = this.clipboard.width;
        this.selection.height = this.clipboard.height;
        this.selection.imageSize = { x: this.clipboard.imageSize.x, y: this.clipboard.imageSize.y };
        this.selection.ellipseRad = { x: this.clipboard.ellipseRad.x, y: this.clipboard.ellipseRad.y };
        this.selection.endingPos = { x: Math.abs(this.selection.width), y: Math.abs(this.selection.height) };
        this.selection.image = new Image();
        this.selection.image.src = this.getImageURL(this.clipboard.imageData, this.selection.imageSize.x, this.selection.imageSize.y);
        this.drawSelection({ x: 1, y: 1 });
    }

    // tslint:disable:cyclomatic-complexity
    scaleSelection(mouseMovement: Vec2): void {
        if (!this.shiftPressed) {
            switch (this.controlPointName) {
                case ControlPointName.top:
                    this.selection.ellipseRad.y -= mouseMovement.y / 2;
                    this.selection.height -= mouseMovement.y;
                    this.selection.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.bottom:
                    this.selection.ellipseRad.y += mouseMovement.y / 2;
                    this.selection.height += mouseMovement.y;
                    this.selection.endingPos.y += mouseMovement.y;
                    break;
                case ControlPointName.left:
                    this.selection.ellipseRad.x -= mouseMovement.x / 2;
                    this.selection.width -= mouseMovement.x;
                    this.selection.imagePosition.x += mouseMovement.x;
                    break;
                case ControlPointName.right:
                    this.selection.ellipseRad.x += mouseMovement.x / 2;
                    this.selection.width += mouseMovement.x;
                    this.selection.endingPos.x += mouseMovement.x;
                    break;
                case ControlPointName.topLeft:
                    this.selection.ellipseRad.x -= mouseMovement.x / 2;
                    this.selection.ellipseRad.y -= mouseMovement.y / 2;
                    this.selection.width -= mouseMovement.x;
                    this.selection.height -= mouseMovement.y;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.topRight:
                    this.selection.ellipseRad.x += mouseMovement.x / 2;
                    this.selection.ellipseRad.y -= mouseMovement.y / 2;
                    this.selection.width += mouseMovement.x;
                    this.selection.height -= mouseMovement.y;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.bottomLeft:
                    this.selection.ellipseRad.x -= mouseMovement.x / 2;
                    this.selection.ellipseRad.y += mouseMovement.y / 2;
                    this.selection.width -= mouseMovement.x;
                    this.selection.height += mouseMovement.y;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.endingPos.y += mouseMovement.y;
                    break;
                case ControlPointName.bottomRight:
                    this.selection.ellipseRad.x += mouseMovement.x / 2;
                    this.selection.ellipseRad.y += mouseMovement.y / 2;
                    this.selection.width += mouseMovement.x;
                    this.selection.height += mouseMovement.y;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.endingPos.y += mouseMovement.y;
                    break;
            }
        } else {
            switch (this.controlPointName) {
                case ControlPointName.top:
                    this.selection.ellipseRad.y -= mouseMovement.y;
                    this.selection.height -= mouseMovement.y * 2;
                    this.selection.imagePosition.y += mouseMovement.y;
                    this.selection.endingPos.y -= mouseMovement.y;
                    break;
                case ControlPointName.bottom:
                    this.selection.ellipseRad.y += mouseMovement.y;
                    this.selection.height += mouseMovement.y * 2;
                    this.selection.endingPos.y += mouseMovement.y;
                    this.selection.imagePosition.y -= mouseMovement.y;
                    break;
                case ControlPointName.left:
                    this.selection.ellipseRad.x -= mouseMovement.x;
                    this.selection.width -= mouseMovement.x * 2;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.endingPos.x -= mouseMovement.x;
                    break;
                case ControlPointName.right:
                    this.selection.ellipseRad.x += mouseMovement.x;
                    this.selection.width += mouseMovement.x * 2;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.imagePosition.x -= mouseMovement.x;
                    break;
                case ControlPointName.topLeft:
                    this.selection.ellipseRad.x -= mouseMovement.x;
                    this.selection.ellipseRad.y -= mouseMovement.y;
                    this.selection.width -= mouseMovement.x * 2;
                    this.selection.height -= mouseMovement.y * 2;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.imagePosition.y += mouseMovement.y;
                    this.selection.endingPos.x -= mouseMovement.x;
                    this.selection.endingPos.y -= mouseMovement.y;
                    break;
                case ControlPointName.topRight:
                    this.selection.ellipseRad.x += mouseMovement.x;
                    this.selection.ellipseRad.y -= mouseMovement.y;
                    this.selection.width += mouseMovement.x * 2;
                    this.selection.height -= mouseMovement.y * 2;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.imagePosition.y += mouseMovement.y;
                    this.selection.endingPos.y -= mouseMovement.y;
                    this.selection.imagePosition.x -= mouseMovement.x;
                    break;
                case ControlPointName.bottomLeft:
                    this.selection.ellipseRad.x -= mouseMovement.x;
                    this.selection.ellipseRad.y += mouseMovement.y;
                    this.selection.width -= mouseMovement.x * 2;
                    this.selection.height += mouseMovement.y * 2;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.endingPos.y += mouseMovement.y;
                    this.selection.imagePosition.y -= mouseMovement.y;
                    this.selection.endingPos.x -= mouseMovement.x;
                    break;
                case ControlPointName.bottomRight:
                    this.selection.ellipseRad.x += mouseMovement.x;
                    this.selection.ellipseRad.y += mouseMovement.y;
                    this.selection.width += mouseMovement.x * 2;
                    this.selection.height += mouseMovement.y * 2;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.endingPos.y += mouseMovement.y;
                    this.selection.imagePosition.x -= mouseMovement.x;
                    this.selection.imagePosition.y -= mouseMovement.y;
                    break;
            }
        }

        this.scaled = true;
        // this.flip = this.flipDirection(this.selection);
    }

    flipImage(): void {
        if (this.selection.width < 0 && this.selection.height < 0 && this.flip !== FlipDirection.diagonal) {
            this.flip = FlipDirection.diagonal;
            this.drawFlippedImage({ x: -1, y: -1 }, this.selection.imageSize);
            return;
        }
        if (this.selection.width > 0 && this.selection.height < 0 && this.flip !== FlipDirection.vertical) {
            this.drawFlippedImage({ x: 1, y: -1 }, { x: 0, y: this.selection.imageSize.y });
            // ctx.save();
            // ctx.translate(0, canvas.height);
            // ctx.scale(1,-1);
            // ctx.drawImage(this.baseImage, 0, 0, canvas.width,canvas.height);
            // ctx.restore();
            // this.selection.imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
            // this.selection.image = new Image();
            // tslint:disable-next-line:max-line-length
            // this.selection.image.src = this.selection.getImageURL(this.selection.imageData, this.selection.imageSize.x, this.selection.imageSize.y);
            this.flip = FlipDirection.vertical;
            return;
        }
        if (this.selection.width < 0 && this.selection.height > 0 && this.flip !== FlipDirection.horizontal) {
            this.drawFlippedImage({ x: -1, y: 1 }, { x: this.selection.imageSize.x, y: 0 });
            this.flip = FlipDirection.horizontal;
            return;
        }
        if (this.selection.width > 0 && this.selection.height > 0 && this.flip !== FlipDirection.none) {
            this.flip = FlipDirection.none;
            this.drawFlippedImage({ x: 1, y: 1 }, { x: 0, y: 0 });
            // ctx.drawImage(this.baseImage, 0, 0, canvas.width,canvas.height);
            // ctx.restore();
            // this.selection.imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
            // this.selection.image = new Image();
            // tslint:disable-next-line:max-line-length
            // this.selection.image.src = this.selection.getImageURL(this.selection.imageData, this.selection.imageSize.x, this.selection.imageSize.y);
        }
    }

    drawFlippedImage(scale: Vec2, translation: Vec2): void {}

    // flipDirection(selection:SelectionImage) : FlipDirection {
    //   if(selection.width < 0 && selection.height <0){
    //     return FlipDirection.diagonal;
    //   }
    //   if(selection.width > 0 && selection.height <0){
    //     return  FlipDirection.vertical;
    //   }
    //   if(selection.width < 0 && selection.height > 0){
    //     return FlipDirection.horizontal;
    //   }
    //   return FlipDirection.none;
    // }
}
