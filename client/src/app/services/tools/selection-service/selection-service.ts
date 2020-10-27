import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    lineWidth: number = 1;
    strokeColor: string;
    shiftPressed: boolean = false;
    height: number;
    width: number;
    mousePosition: Vec2;
    mouseMouvement: Vec2 = { x: 0, y: 0 };
    xSign: number;
    ySign: number;
    dottedLineWidth: number = 2;
    dottedSpace: number = 10;
    modifSelectSquare: number = 10;
    imageData: ImageData;
    copyImageInitialPos: Vec2 = { x: 0, y: 0 };
    selectRectInitialPos: Vec2 = { x: 0, y: 0 };
    inSelection: boolean = false;
    distanceX: number;
    distanceY: number;
    ellipseRad: Vec2 = { x: 0, y: 0 };
    image: HTMLImageElement = new Image();

    onMouseDown(event: MouseEvent): void {
        // initialisation of effects
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
                // this.drawSelectionRect(this.drawingService.previewCtx, this.mouseDownCoord, this.shiftPressed);

                this.selectRectInitialPos = this.mouseDownCoord;
                // console.log(" initial pos = " + this.selectRectInitialPos.x + this.selectRectInitialPos.y);
                this.copyImageInitialPos = this.copySelection();
                this.drawSelection(this.drawingService.previewCtx, this.mouseDownCoord, this.copyImageInitialPos);
                // this.drawingService.previewCtx.putImageData(this.imageData, this.copyImageInitialPos.x, this.copyImageInitialPos.y);
            } else if (this.inSelection) {
                this.pasteSelection(
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                    this.image,
                    this.imageData,
                );
            }
        }

        this.mouseDown = false;
        this.inSelection = false;
        // this.mouseEnter = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.inSelection) {
                // console.log(this.selectRectInitialPos);
                this.mouseMouvement.x = mousePosition.x - this.mouseDownCoord.x;
                this.mouseMouvement.y = mousePosition.y - this.mouseDownCoord.y;
                this.drawingService.baseCtx.fillStyle = 'white';
                this.drawingService.baseCtx.fillRect(this.selectRectInitialPos.x, this.selectRectInitialPos.y, this.width, this.height);
                // this.drawSelectionRect(this.drawingService.previewCtx, {
                //     x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                //     y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                // }, this.shiftPressed);
                this.drawSelection(
                    this.drawingService.previewCtx,
                    {
                        x: this.selectRectInitialPos.x + this.mouseMouvement.x,
                        y: this.selectRectInitialPos.y + this.mouseMouvement.y,
                    },
                    { x: this.copyImageInitialPos.x + this.mouseMouvement.x, y: this.copyImageInitialPos.y + this.mouseMouvement.y },
                );
                // this.drawingService.previewCtx.putImageData(
                //     this.imageData,
                //     this.copyImageInitialPos.x + this.mouseMouvement.x,
                //     this.copyImageInitialPos.y + this.mouseMouvement.y,
                // );
            } else {
                this.mousePosition = mousePosition;
                this.drawPreview();
            }
        }
        // console.log(this.mouseDown);
    }

    onKeyEscape(event: KeyboardEvent): void {
        if (this.inSelection || this.mouseDown || !this.drawingService.isPreviewCanvasBlank()) {
            this.drawingService.baseCtx.putImageData(this.imageData, this.copyImageInitialPos.x, this.copyImageInitialPos.y);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
            this.inSelection = false;
        }
    }

    // onMouseOut(event: MouseEvent): void {}

    // onMouseEnter(event: MouseEvent): void {}

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
        this.drawingService.baseCtx.strokeStyle = '#000000'; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = '#000000';
        this.drawingService.baseCtx.lineJoin = 'miter';
        this.drawingService.baseCtx.lineCap = 'square';
        this.drawingService.previewCtx.lineJoin = 'miter';
        this.drawingService.previewCtx.lineCap = 'square';
        // this.drawingService.baseCtx.setLineDash([0, 0]); // reset
        // this.drawingService.previewCtx.setLineDash([0, 0]);
    }

    selectAll(): void {
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
                this.distanceX = this.mousePosition.x - this.mouseDownCoord.x;
                this.distanceY = this.mousePosition.y - this.mouseDownCoord.y;
                // width an height calcul while keeping position sign
                this.height = Math.sign(this.distanceY) * Math.abs(Math.min(this.distanceX, this.distanceY));
                this.width = Math.sign(this.distanceX) * Math.abs(Math.min(this.distanceX, this.distanceY));
            } else {
                this.height = this.mousePosition.y - this.mouseDownCoord.y;
                this.width = this.mousePosition.x - this.mouseDownCoord.x;
            }
            ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);
        }
    }

    drawSelectionRect(ctx: CanvasRenderingContext2D, mouseDownCoord: Vec2): void {
        // this.height = this.mousePosition.y - this.mouseDownCoord.y;
        // this.width = this.mousePosition.x - this.mouseDownCoord.x;
        //  this.image = this.drawingService.previewCtx.canvas.toDataURL();
        // ctx.setLineDash([]);
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

        this.xSign = Math.sign(this.mousePosition.x - this.mouseDownCoord.x);
        this.ySign = Math.sign(this.mousePosition.y - this.mouseDownCoord.y);

        this.image.src = this.getImageURL(this.imageData, this.width, this.height);

        if (this.xSign > 0 && this.ySign > 0) {
            return { x: this.mouseDownCoord.x, y: this.mouseDownCoord.y };
        } else if (this.xSign > 0 && this.ySign < 0) {
            return { x: this.mouseDownCoord.x, y: this.mousePosition.y };
        } else if (this.xSign < 0 && this.ySign < 0) {
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

            return false;
        }
        return false;
    }

    drawPreview(): void {}

    drawSelection(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, imagePosition: Vec2): void { }

    pasteSelection(position: Vec2, image: HTMLImageElement, imageData: ImageData): void {}

    getImageURL(imgData: ImageData, width: number, height: number) {
        let canvas = document.createElement('canvas') as HTMLCanvasElement;
        let ctx = (canvas.getContext('2d') as CanvasRenderingContext2D) as CanvasRenderingContext2D;
        canvas.width = width;
        canvas.height = height;
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL(); // image URL
    }
}
