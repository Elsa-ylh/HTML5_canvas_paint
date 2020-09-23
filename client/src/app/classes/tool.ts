import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

export enum ToolUsed {
    NONE = 0,
    Pencil = 1,
    Eraser = 2,
    Brush = 3,
    Line = 4,
    Rectangle = 5,
    Ellipse = 6,
    Color = 7,
}

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    mouseMove: Boolean = false; // pr le point
    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }
}
