import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
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
    private pixelMouvement: number = 3;
    private mouvementDelay: number = 100;
    private minTimeMovement: number = 500;
    private lineWidth: number = 1;
    private modifSelectSquare: number = 10;
    dottedSpace: number = 10;

    shiftPressed: boolean = false;
    height: number;
    width: number;
    mousePosition: Vec2;
    mouseMouvement: Vec2 = { x: 0, y: 0 };

    imageData: ImageData;
    copyImageInitialPos: Vec2 = { x: 0, y: 0 };
    selectRectInitialPos: Vec2 = { x: 0, y: 0 };
    inSelection: boolean = false;
    ellipseRad: Vec2 = { x: 0, y: 0 };
    image: HTMLImageElement = new Image();
    isAllSelect: boolean = false;
    leftArrow: boolean = false;
    rightArrow: boolean = false;
    upArrow: boolean = false;
    downArrow: boolean = false;
    subscriptionTimer: Subscription;
    subscriptionMoveLeft: Subscription;
    subscriptionMoveRight: Subscription;
    subscriptionMoveUp: Subscription;
    subscriptionMoveDown: Subscription;
    time: number = 0;
    timerStarted: boolean = false;
    timerLeft: boolean = false;
    timerRight: boolean = false;
    timerUp: boolean = false;
    timerDown: boolean = false;

    onMouseDown(event: MouseEvent): void {
        this.clearEffectTool();
        this.drawingService.previewCtx.lineWidth = this.lineWidth;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.fillStyle = 'black';

        this.mouseDown = event.button === MouseButton.Left;

        if (this.mouseDown) {
            if (this.mousePosition && this.mouseDownCoord) {
                this.inSelection = this.isInsideSelection(this.getPositionFromMouse(event));
            }

            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
        this.mousePosition = this.mouseDownCoord;
    }

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.inSelection) {
                this.mouseMouvement.x = mousePosition.x - this.mouseDownCoord.x;
                this.mouseMouvement.y = mousePosition.y - this.mouseDownCoord.y;
                this.clearSelection(this.selectRectInitialPos, this.width, this.height);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
            } else {
                this.mousePosition = mousePosition;
                this.drawPreview();
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {
        if (this.inSelection || this.mouseDown || !this.drawingService.isPreviewCanvasBlank()) {
            this.drawingService.baseCtx.putImageData(this.imageData, this.copyImageInitialPos.x, this.copyImageInitialPos.y);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
            this.inSelection = false;
            this.copyImageInitialPos = { x: 0, y: 0 };
            this.selectRectInitialPos = { x: 0, y: 0 };
            this.mouseMouvement = { x: 0, y: 0 };

            if (this.timerDown) {
                this.subscriptionMoveDown.unsubscribe();
            }
            if (this.timerLeft) {
                this.subscriptionMoveLeft.unsubscribe();
            }
            if (this.timerRight) {
                this.subscriptionMoveRight.unsubscribe();
            }
            if (this.timerUp) {
                this.subscriptionMoveUp.unsubscribe();
            }
            if (this.timerStarted) {
                this.subscriptionTimer.unsubscribe();
            }
        }
    }

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
        this.isAllSelect = true;
        this.width = this.drawingService.canvas.width;
        this.height = this.drawingService.canvas.height;
        this.mouseDownCoord = { x: 1, y: 1 };
        this.mousePosition = { x: this.width, y: this.height };
        this.copyImageInitialPos = { x: 0, y: 0 };
        this.selectRectInitialPos = { x: 0, y: 0 };
        this.imageData = this.drawingService.baseCtx.getImageData(0, 0, this.width, this.height);
        this.drawSelection(this.drawingService.previewCtx, { x: 0, y: 0 }, { x: 0, y: 0 });
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, shiftPressed: boolean): void {
        if (this.mouseDownCoord !== this.mousePosition) {
            ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
            if (shiftPressed) {
                const distanceX = this.mousePosition.x - this.mouseDownCoord.x;
                const distanceY = this.mousePosition.y - this.mouseDownCoord.y;
                // calculate width and height while keeping sign
                this.height = Math.sign(distanceY) * Math.abs(Math.min(distanceX, distanceY));
                this.width = Math.sign(distanceX) * Math.abs(Math.min(distanceX, distanceY));
            } else {
                this.height = this.mousePosition.y - this.mouseDownCoord.y;
                this.width = this.mousePosition.x - this.mouseDownCoord.x;
            }
            ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);
        }
    }

    drawSelectionRect(ctx: CanvasRenderingContext2D, mouseDownCoord: Vec2): void {
        ctx.strokeRect(mouseDownCoord.x, mouseDownCoord.y, this.width, this.height);
        ctx.setLineDash([]);
        ctx.fillRect(
            mouseDownCoord.x + this.width / 2 - this.modifSelectSquare / 2,
            mouseDownCoord.y - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        ctx.fillRect(
            mouseDownCoord.x - this.modifSelectSquare / 2,
            mouseDownCoord.y + this.height / 2 - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        ctx.fillRect(
            mouseDownCoord.x + this.width / 2 - this.modifSelectSquare / 2,
            mouseDownCoord.y + this.height - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        ctx.fillRect(
            mouseDownCoord.x + this.width - this.modifSelectSquare / 2,
            mouseDownCoord.y + this.height / 2 - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        ctx.fillRect(
            mouseDownCoord.x - this.modifSelectSquare / 2,
            mouseDownCoord.y - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        ctx.fillRect(
            mouseDownCoord.x + this.width - this.modifSelectSquare / 2,
            mouseDownCoord.y - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        ctx.fillRect(
            mouseDownCoord.x - this.modifSelectSquare / 2,
            mouseDownCoord.y + this.height - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        ctx.fillRect(
            mouseDownCoord.x + this.width - this.modifSelectSquare / 2,
            mouseDownCoord.y + this.height - this.modifSelectSquare / 2,
            this.modifSelectSquare,
            this.modifSelectSquare,
        );
        ctx.setLineDash([this.dottedSpace, this.dottedSpace]);
    }

    copySelection(): Vec2 {
        this.imageData = this.drawingService.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);

        const xSign = Math.sign(this.mousePosition.x - this.mouseDownCoord.x);
        const ySign = Math.sign(this.mousePosition.y - this.mouseDownCoord.y);

        this.image.src = this.getImageURL(this.imageData, this.width, this.height);

        if (xSign > 0 && ySign > 0) {
            return { x: this.mouseDownCoord.x, y: this.mouseDownCoord.y };
        } else if (xSign > 0 && ySign < 0) {
            return { x: this.mouseDownCoord.x, y: this.mousePosition.y };
        } else if (xSign < 0 && ySign < 0) {
            return { x: this.mousePosition.x, y: this.mousePosition.y };
        } else {
            return { x: this.mousePosition.x, y: this.mouseDownCoord.y };
        }
    }

    isInsideSelection(mouse: Vec2): boolean {
        if (
            this.mouseDownCoord.x !== 0 &&
            this.mouseDownCoord.x !== 0 &&
            this.mousePosition.x !== 0 &&
            this.mousePosition.y !== 0 &&
            !this.drawingService.isPreviewCanvasBlank()
        ) {
            const minX = Math.min(this.mousePosition.x, this.mouseDownCoord.x);
            const maxX = Math.max(this.mousePosition.x, this.mouseDownCoord.x);
            const minY = Math.min(this.mousePosition.y, this.mouseDownCoord.y);
            const maxY = Math.max(this.mousePosition.y, this.mouseDownCoord.y);

            if (mouse.x > minX && mouse.x < maxX && mouse.y > minY && mouse.y < maxY) {
                return true;
            }
        }
        return false;
    }

    protected drawPreview(): void {}

    protected drawSelection(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, imagePosition: Vec2): void {}

    protected getImageURL(imgData: ImageData, width: number, height: number): string {
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
            this.clearSelection(this.selectRectInitialPos, this.width, this.height);
            if (!this.leftArrow) {
                this.mouseMouvement.x -= this.pixelMouvement;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
            }
            this.leftArrow = true;
            this.startTimer();
            if (this.time >= this.minTimeMovement) {
                this.moveSelectiontimerLeft();
            }
        }
    }

    onRightArrow(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.clearSelection(this.selectRectInitialPos, this.width, this.height);
            if (!this.rightArrow) {
                this.mouseMouvement.x += this.pixelMouvement;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
            }
            this.rightArrow = true;
            this.startTimer();
            if (this.time >= this.minTimeMovement) {
                this.moveSelectiontimerRight();
            }
        }
    }

    onUpArrow(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.clearSelection(this.selectRectInitialPos, this.width, this.height);
            if (!this.upArrow) {
                this.mouseMouvement.y -= this.pixelMouvement;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
            }
            this.upArrow = true;
            this.startTimer();
            if (this.time >= this.minTimeMovement) {
                this.moveSelectiontimerUp();
            }
        }
    }

    onDownArrow(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.clearSelection(this.selectRectInitialPos, this.width, this.height);
            if (!this.downArrow) {
                this.mouseMouvement.y += this.pixelMouvement;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
            }
            this.downArrow = true;
            this.startTimer();
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
            const mainTimer = interval(this.mouvementDelay);
            this.subscriptionTimer = mainTimer.subscribe(() => (this.time += this.mouvementDelay));
        }
    }

    moveSelectiontimerLeft(): void {
        if (!this.timerLeft) {
            this.timerLeft = true;
            const timerMove = timer(this.mouvementDelay, this.mouvementDelay);
            this.subscriptionMoveLeft = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
                this.mouseMouvement.x -= this.pixelMouvement;
            });
        }
    }

    moveSelectiontimerRight(): void {
        if (!this.timerRight) {
            this.timerRight = true;
            const timerMove = timer(this.mouvementDelay, this.mouvementDelay);
            this.subscriptionMoveRight = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
                this.mouseMouvement.x += this.pixelMouvement;
            });
        }
    }

    moveSelectiontimerUp(): void {
        if (!this.timerUp) {
            this.timerUp = true;
            const timerMove = timer(this.mouvementDelay, this.mouvementDelay);
            this.subscriptionMoveUp = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
                this.mouseMouvement.y -= this.pixelMouvement;
            });
        }
    }

    moveSelectiontimerDown(): void {
        if (!this.timerDown) {
            this.timerDown = true;
            const timerMove = timer(this.mouvementDelay, this.mouvementDelay);
            this.subscriptionMoveDown = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
                this.mouseMouvement.y += this.pixelMouvement;
            });
        }
    }

    resetTimer(): void {
        if (!this.upArrow && !this.downArrow && !this.leftArrow && !this.rightArrow && this.timerStarted) {
            this.subscriptionTimer.unsubscribe();
            this.timerStarted = false;
            this.time = 0;
        }
    }
}
