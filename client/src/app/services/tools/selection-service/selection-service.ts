import { Injectable } from '@angular/core';
import { ArrowInfo, MOUVEMENTDELAY, PIXELMOUVEMENT } from '@app/classes/arrow-info';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
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

    controlGroup: ControlGroup;

    // controlPointTop: ControlPoint;
    // controlPointBottom: ControlPoint;
    // controlPointLeft: ControlPoint;
    // controlPointRight: ControlPoint;
    // controlPointTopLeft: ControlPoint;
    // controlPointTopRight: ControlPoint;
    // controlPointBottomRight: ControlPoint;
    // controlPointBottomLeft: ControlPoint;

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
                    // this.controlPointTopLeft = new ControlPoint(this.drawingService);
                    // this.controlPointTop = new ControlPoint(this.drawingService);
                    // this.controlPointTopRight = new ControlPoint(this.drawingService);

                    // this.controlPointLeft = new ControlPoint(this.drawingService);
                    // this.controlPointRight = new ControlPoint(this.drawingService);

                    // this.controlPointBottomRight = new ControlPoint(this.drawingService);
                    // this.controlPointBottom = new ControlPoint(this.drawingService);
                    // this.controlPointBottomLeft = new ControlPoint(this.drawingService);
                    // this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                    this.drawSelection(this.imagePosition);
                    this.cleared = false;
                    // ask about that
                }

                // move or scale selection
            } else if (this.inSelection || this.controlPointName !== ControlPointName.none) {
                //     // this.imagePosition = { x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y };
                this.drawSelection(this.imagePosition);
                //     // this.startingPos = { x: this.startingPos.x + this.mouseMovement.x, y: this.startingPos.y + this.mouseMovement.y };
                //     // this.endingPos = { x: this.endingPos.x + this.mouseMovement.x, y: this.endingPos.y + this.mouseMovement.y };
                this.mouseMovement = { x: 0, y: 0 };

                this.controlGroup.resetSelected();
                // this.controlPointTopLeft.selected = false;
                // this.controlPointTopRight.selected = false;
                // this.controlPointTop.selected = false;

                // this.controlPointLeft.selected = false;
                // this.controlPointRight.selected = false;

                // this.controlPointBottomLeft.selected = false;
                // this.controlPointBottomRight.selected = false;
                // this.controlPointBottom.selected = false;

                // this.imagePosition = this.updateSelectionPositions();

                // } else if (this.controlPointName !== ControlPointName.none) {
                //     this.drawSelection(this.imagePosition);
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
        // this.controlPointTopLeft.setPosition({ x: this.imagePosition.x - CPSIZE / 2, y: this.imagePosition.y - CPSIZE / 2 });
        // this.controlPointTop.setPosition({ x: this.imagePosition.x + this.width / 2 - CPSIZE / 2, y: this.imagePosition.y - CPSIZE / 2 });
        // this.controlPointTopRight.setPosition({ x: this.imagePosition.x + this.width - CPSIZE / 2, y: this.imagePosition.y - CPSIZE / 2 });

        // this.controlPointLeft.setPosition({ x: this.imagePosition.x - CPSIZE / 2, y: this.imagePosition.y + this.height / 2 - CPSIZE / 2 });
        // this.controlPointRight.setPosition({
        //     x: this.imagePosition.x + this.width - CPSIZE / 2,
        //     y: this.imagePosition.y + this.height / 2 - CPSIZE / 2,
        // });

        // this.controlPointBottomRight.setPosition({ x: this.endingPos.x - CPSIZE / 2, y: this.endingPos.y - CPSIZE / 2 });
        // this.controlPointBottom.setPosition({ x: this.endingPos.x - this.width / 2 - CPSIZE / 2, y: this.endingPos.y - CPSIZE / 2 });
        // this.controlPointBottomLeft.setPosition({ x: this.endingPos.x - this.width - CPSIZE / 2, y: this.endingPos.y - CPSIZE / 2 });

        this.controlGroup.draw();
        // this.controlPointTopLeft.draw();
        // this.controlPointTop.draw();
        // this.controlPointTopRight.draw();

        // this.controlPointLeft.draw();
        // this.controlPointRight.draw();

        // this.controlPointBottomRight.draw();
        // this.controlPointBottom.draw();
        // this.controlPointBottomLeft.draw();
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
                // first mouvement
                this.mouseMovement.x -= PIXELMOUVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            }
            this.leftArrow.arrowPressed = true;
            this.startTimer();
            // for continuous movement
            if (this.time >= this.minTimeMovement) {
                this.moveSelectiontimerLeft();
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
                // first mouvement
                this.mouseMovement.x += PIXELMOUVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            }
            this.rightArrow.arrowPressed = true;
            this.startTimer();
            // for continuous movement
            if (this.time >= this.minTimeMovement) {
                this.moveSelectiontimerRight();
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
                // first mouvement
                this.mouseMovement.y -= PIXELMOUVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            }
            this.upArrow.arrowPressed = true;
            this.startTimer();
            // for continuous movement
            if (this.time >= this.minTimeMovement) {
                this.moveSelectiontimerUp();
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
                this.mouseMovement.y += PIXELMOUVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            }
            this.downArrow.arrowPressed = true;
            this.startTimer();
            // for continuous movement
            if (this.time >= this.minTimeMovement) {
                this.moveSelectiontimerDown();
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
            const mainTimer = interval(MOUVEMENTDELAY);
            this.subscriptionTimer = mainTimer.subscribe(() => (this.time += MOUVEMENTDELAY));
        }
    }

    moveSelectiontimerLeft(): void {
        if (!this.leftArrow.timerStarted) {
            this.leftArrow.timerStarted = true;
            const timerMove = timer(MOUVEMENTDELAY, MOUVEMENTDELAY);

            this.leftArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMovement.x -= PIXELMOUVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            });
        }
    }

    moveSelectiontimerRight(): void {
        if (!this.rightArrow.timerStarted) {
            this.rightArrow.timerStarted = true;
            const timerMove = timer(MOUVEMENTDELAY, MOUVEMENTDELAY);

            this.rightArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMovement.x += PIXELMOUVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            });
        }
    }

    moveSelectiontimerUp(): void {
        if (!this.upArrow.timerStarted) {
            this.upArrow.timerStarted = true;
            const timerMove = timer(MOUVEMENTDELAY, MOUVEMENTDELAY);

            this.upArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMovement.y -= PIXELMOUVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMovement.x, y: this.imagePosition.y + this.mouseMovement.y });
            });
        }
    }

    moveSelectiontimerDown(): void {
        if (!this.downArrow.timerStarted) {
            this.downArrow.timerStarted = true;
            const timerMove = timer(MOUVEMENTDELAY, MOUVEMENTDELAY);

            this.downArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMovement.y += PIXELMOUVEMENT;
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
        if (!this.cleared) {
            this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
            this.cleared = true;
        }

        this.copyImage();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    deleteImage(): void {
        this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
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
