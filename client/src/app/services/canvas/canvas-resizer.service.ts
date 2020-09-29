import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Vec2 } from '@app/classes/vec2';

export enum ResizeDirection {
    vertical,
    horizontal,
    verticalAndHorizontal,
}

@Injectable({
    providedIn: 'root',
})
export class CanvasResizerService {
    MIN_CANVAS_SIZE: number = 250;
    MAX_WIDTH_SIZE: number = 1920;
    MAX_HEIGHT_SIZE: number = 1080;
    minSizeWindow: number = 500;

    WORK_AREA_PADDING_SIZE: number = 50;

    SIDEBAR_WIDTH: number = 226;
    ICON_WIDTH: number = 50;

    HOOK_HEIGHT: number = 50;
    HOOK_WIDTH: number = 150;

    DEFAULT_WIDTH: number = (window.innerWidth - this.SIDEBAR_WIDTH - this.ICON_WIDTH) / 2;
    DEFAULT_HEIGHT: number = window.innerHeight / 2;
    // Cette variable est très importante.
    // La variable ci-dessous est la taille du canvas.
    // Elle est modifiable et accesible en tout temps, à faire très attention.
    canvasSize: Vec2 = { x: this.DEFAULT_WIDTH, y: this.DEFAULT_HEIGHT };

    isVerticalDown: boolean = false;

    onVerticalDown(event: MouseEvent): void {
        this.isVerticalDown = event.button === MouseButton.Left;
    }

    // https://stackoverflow.com/questions/8977369/drawing-png-to-a-canvas-element-not-showing-transparency
    onResize(event: MouseEvent, baseCanvas: HTMLCanvasElement, resizeDirection: ResizeDirection): void {
        if (this.isVerticalDown) {
            const originalImage = new Image();
            originalImage.src = baseCanvas.toDataURL('image/png', 1);

            // Has to be greater than 250 pixels
            if (this.canvasSize.y + event.movementY >= this.MIN_CANVAS_SIZE) {
                // We don't have to assign the canvas any new width or height value, as there is already
                // an auto updated attributes linked to canvasSize variable
                switch (resizeDirection) {
                    case ResizeDirection.vertical:
                        this.canvasSize.y += event.movementY;
                        break;
                    case ResizeDirection.horizontal:
                        this.canvasSize.x += event.movementX;
                        break;
                }

                // async because images are not always loaded instantaneously after execution of the following line
                originalImage.onload = () => {
                    baseCanvas.getContext('2d')?.drawImage(originalImage, 0, 0);
                };
            }
        }
    }

    onVerticalUp(event: MouseEvent): void {
        this.isVerticalDown = false;
    }

    onVerticalOut(event: MouseEvent): void {
        this.isVerticalDown = false;
    }
}
