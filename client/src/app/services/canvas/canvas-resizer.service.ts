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
}
