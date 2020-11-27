import { Subscription } from 'rxjs';

export const PIXELMOVEMENT = 3;
export const MOVEMENTDELAY = 100;
export class ArrowInfo {
    constructor() {
        this.timerStarted = false;
        this.arrowPressed = false;
    }
    arrowPressed: boolean;
    subscription: Subscription;
    timerStarted: boolean;
}
