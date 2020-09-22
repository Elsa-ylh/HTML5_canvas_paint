import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class CanvasResizerService {
    MIN_CANVAS_SIZE: number = 250;
    MAX_WIDTH_SIZE: number = 1920;
    MAX_HEIGHT_SIZE: number = 1080;
    minSizeWindow: number = 500;
    sidebarSize: number = 200;

    DEFAULT_WIDTH = window.innerWidth / 2;
    DEFAULT_HEIGHT = window.innerHeight / 2;

    // Cette variable est très importante.
    // La variable ci-dessous est la taille du canvas.
    // Elle est modifiable et accesible en tout temps, à faire très attention.
    canvasSize: Vec2 = { x: this.MIN_CANVAS_SIZE, y: this.MIN_CANVAS_SIZE };

    onResize(event: Event): void {
        if (window.innerWidth <= this.minSizeWindow && window.innerHeight <= this.minSizeWindow) {
            this.canvasSize.x = this.MIN_CANVAS_SIZE;
            this.canvasSize.y = this.MIN_CANVAS_SIZE;
        } else {
            // Might be made responsive
            this.canvasSize.x = this.DEFAULT_WIDTH - this.sidebarSize;
            this.canvasSize.y = this.DEFAULT_HEIGHT;
        }
    }
}
