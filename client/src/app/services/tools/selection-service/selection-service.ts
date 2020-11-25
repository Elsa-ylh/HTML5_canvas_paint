import { Injectable } from '@angular/core';
import { ArrowInfo, MOUVEMENTDELAY, PIXELMOUVEMENT } from '@app/classes/arrow-info';
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
    readonly minTimeMovement: number = 500;
    lineWidth: number = 1;
    readonly modifSelectSquare: number = 10;
    dottedSpace: number = 10;

    shiftPressed: boolean = false;
    height: number;
    width: number;
    mouseMouvement: Vec2 = { x: 0, y: 0 };
    startingPos: Vec2;
    endingPos: Vec2;

    imageData: ImageData;
    copyImageInitialPos: Vec2 = { x: 0, y: 0 };
    imagePosition: Vec2 = { x: 0, y: 0 };
    inSelection: boolean = false;
    image: HTMLImageElement = new Image();
    isAllSelect: boolean = false;
    ellipseRad: Vec2 = { x: 0, y: 0 };

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

    // intialization clipboard
    clipboard: ImageClipboard = new ImageClipboard();

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // drawing selection
            if (this.startingPos.x !== this.endingPos.x && this.startingPos.y !== this.endingPos.y && !this.inSelection) {
                this.endingPos = mousePosition;
                if (!this.shiftPressed) {
                    this.height = this.endingPos.y - this.startingPos.y;
                    this.width = this.endingPos.x - this.startingPos.x;
                }

                if (this.width !== 0 && this.height !== 0) {
                    this.imagePosition = this.copyImageInitialPos = this.copySelection();
                    // this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                    this.drawSelection(this.copyImageInitialPos);

                    this.cleared = false;
                    // ask about that
                    // this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                }

                // moving selection
            } else if (this.inSelection) {
                this.imagePosition = { x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y };
                this.drawSelection(this.imagePosition);
                this.startingPos = { x: this.startingPos.x + this.mouseMouvement.x, y: this.startingPos.y + this.mouseMouvement.y };
                this.endingPos = { x: this.endingPos.x + this.mouseMouvement.x, y: this.endingPos.y + this.mouseMouvement.y };
                this.mouseMouvement = { x: 0, y: 0 };
            }
        }

        this.mouseDown = false;
        this.inSelection = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // move selection
            if (this.inSelection) {
                this.mouseMouvement.x = mousePosition.x - this.mouseDownCoord.x;
                this.mouseMouvement.y = mousePosition.y - this.mouseDownCoord.y;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
                    this.cleared = true;
                }

                // draw selection
            } else {
                if (!this.shiftPressed) {
                    this.ellipseRad = { x: Math.abs(this.width / 2), y: Math.abs(this.height / 2) };
                } else {
                    this.ellipseRad = {
                        x: Math.min(Math.abs(this.width / 2), Math.abs(this.height / 2)),
                        y: Math.min(Math.abs(this.width / 2), Math.abs(this.height / 2)),
                    };
                }
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
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreview();
        }
    }

    onShiftKeyUp(event: KeyboardEvent): void {
        this.shiftPressed = false;
        if (this.mouseDown && !this.inSelection) {
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
        if (!this.isAllSelect) {
            this.isAllSelect = true;
            this.width = this.drawingService.canvas.width;
            this.height = this.drawingService.canvas.height;
            this.startingPos = { x: 1, y: 1 };
            this.endingPos = { x: this.width, y: this.height };
            this.imagePosition = this.copyImageInitialPos = { x: 0, y: 0 };
            this.imageData = this.drawingService.baseCtx.getImageData(0, 0, this.width, this.height);
            this.drawSelection({ x: 0, y: 0 });
        }
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, shiftPressed: boolean): void {
        if (this.startingPos !== this.endingPos) {
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            if (shiftPressed) {
                const distanceX = this.endingPos.x - this.startingPos.x;
                const distanceY = this.endingPos.y - this.startingPos.y;
                // calculate width and height while keeping sign
                this.height = Math.sign(distanceY) * Math.abs(Math.min(distanceX, distanceY));
                this.width = Math.sign(distanceX) * Math.abs(Math.min(distanceX, distanceY));
            } else {
                this.height = this.endingPos.y - this.startingPos.y;
                this.width = this.endingPos.x - this.startingPos.x;
            }
            ctx.strokeRect(this.startingPos.x, this.startingPos.y, this.width, this.height);
        }
    }

    drawSelectionRect(mouseDownCoord: Vec2, width: number, height: number): void {
        this.drawingService.previewCtx.strokeRect(mouseDownCoord.x, mouseDownCoord.y, width, height);
        this.drawingService.previewCtx.setLineDash([]);
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x + width / 2 - this.modifSelectSquare / 2,
            mouseDownCoord.y - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x - this.modifSelectSquare / 2,
            mouseDownCoord.y + height / 2 - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x + width / 2 - this.modifSelectSquare / 2,
            mouseDownCoord.y + height - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x + width - this.modifSelectSquare / 2,
            mouseDownCoord.y + height / 2 - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x - this.modifSelectSquare / 2,
            mouseDownCoord.y - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x + width - this.modifSelectSquare / 2,
            mouseDownCoord.y - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x - this.modifSelectSquare / 2,
            mouseDownCoord.y + height - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        this.drawingService.previewCtx.fillRect(
            mouseDownCoord.x + width - this.modifSelectSquare / 2,
            mouseDownCoord.y + height - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        this.drawingService.previewCtx.setLineDash([this.dottedSpace, this.dottedSpace]);
    }

    copySelection(): Vec2 {
        this.imageData = this.drawingService.baseCtx.getImageData(this.startingPos.x, this.startingPos.y, this.width, this.height);

        const xSign = Math.sign(this.endingPos.x - this.startingPos.x);
        const ySign = Math.sign(this.endingPos.y - this.startingPos.y);

        this.image.src = this.getImageURL(this.imageData, this.width, this.height);

        if (xSign > 0 && ySign > 0) {
            return { x: this.startingPos.x, y: this.startingPos.y };
        } else if (xSign > 0 && ySign < 0) {
            return { x: this.startingPos.x, y: this.endingPos.y };
        } else if (xSign < 0 && ySign < 0) {
            return { x: this.endingPos.x, y: this.endingPos.y };
        } else {
            return { x: this.endingPos.x, y: this.startingPos.y };
        }
    }

    isInsideSelection(mouse: Vec2): boolean {
        if (
            this.startingPos.x !== 0 &&
            this.startingPos.x !== 0 &&
            this.endingPos.x !== 0 &&
            this.endingPos.y !== 0 &&
            !this.drawingService.isPreviewCanvasBlank()
        ) {
            const minX = Math.min(this.endingPos.x, this.startingPos.x);
            const maxX = Math.max(this.endingPos.x, this.startingPos.x);
            const minY = Math.min(this.endingPos.y, this.startingPos.y);
            const maxY = Math.max(this.endingPos.y, this.startingPos.y);

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
                this.mouseMouvement.x -= PIXELMOUVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
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
                this.mouseMouvement.x += PIXELMOUVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
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
                this.mouseMouvement.y -= PIXELMOUVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
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
                this.mouseMouvement.y += PIXELMOUVEMENT;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
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
                this.mouseMouvement.x -= PIXELMOUVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
            });
        }
    }

    moveSelectiontimerRight(): void {
        if (!this.rightArrow.timerStarted) {
            this.rightArrow.timerStarted = true;
            const timerMove = timer(MOUVEMENTDELAY, MOUVEMENTDELAY);

            this.rightArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMouvement.x += PIXELMOUVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
            });
        }
    }

    moveSelectiontimerUp(): void {
        if (!this.upArrow.timerStarted) {
            this.upArrow.timerStarted = true;
            const timerMove = timer(MOUVEMENTDELAY, MOUVEMENTDELAY);

            this.upArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMouvement.y -= PIXELMOUVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
            });
        }
    }

    moveSelectiontimerDown(): void {
        if (!this.downArrow.timerStarted) {
            this.downArrow.timerStarted = true;
            const timerMove = timer(MOUVEMENTDELAY, MOUVEMENTDELAY);

            this.downArrow.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseMouvement.y += PIXELMOUVEMENT;
                this.drawSelection({ x: this.imagePosition.x + this.mouseMouvement.x, y: this.imagePosition.y + this.mouseMouvement.y });
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

    pasteImage(): void {
        this.imageData = this.clipboard.imageData;
        this.imagePosition = { x: 1, y: 1 };
        this.width = this.clipboard.width;
        this.height = this.clipboard.height;
        this.startingPos = { x: 1, y: 1 };
        this.ellipseRad = { x: this.clipboard.ellipseRad.x, y: this.clipboard.ellipseRad.y };
        this.endingPos = { x: Math.abs(this.width), y: Math.abs(this.height) };
        this.image = new Image();
        this.image.src = this.getImageURL(this.clipboard.imageData, this.width, this.height);
        this.drawSelection({ x: 1, y: 1 });
    }

    deleteImage(): void {
        this.clearSelection(this.copyImageInitialPos, Math.abs(this.width), Math.abs(this.height));
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
