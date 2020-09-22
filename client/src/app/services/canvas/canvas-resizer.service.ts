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

    sidebarIconSize: number = 226;
    sidebarAttributesSize: number = 50;
    sidebarTotalSize: number = this.sidebarIconSize + this.sidebarAttributesSize;
    offset: number = 20;

    DEFAULT_WIDTH: number = 640;
    DEFAULT_HEIGHT: number = 480;

    // Cette variable est très importante.
    // La variable ci-dessous est la taille du canvas.
    // Elle est modifiable et accesible en tout temps, à faire très attention.
    canvasSize: Vec2 = { x: this.DEFAULT_WIDTH, y: this.DEFAULT_HEIGHT };

    onResize(event: Event): void {
        if (window.innerWidth - this.sidebarTotalSize + this.offset < this.canvasSize.x) {
            this.canvasSize.x = window.innerWidth - this.sidebarTotalSize - this.offset;
        }
        if (window.innerHeight + this.offset < this.canvasSize.y) {
            this.canvasSize.y = window.innerHeight;
        }
    }
}
