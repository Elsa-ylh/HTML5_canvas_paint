import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

//enum de couleur
export enum MouseButton {
    Left = 2, // =0 on a inverser car le left fesait appel au right
    Middle = 1,
    Right = 0, // =2
    Back = 3,
    Forward = 4,
}

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }
}
