import { Subscription } from 'rxjs';

export const PIXELMOUVEMENT = 3;
export const MOUVEMENTDELAY = 100;
export class ArrowInfo {
    constructor() {
        this.timerStarted = false;
        this.arrowPressed = false;
    }
    arrowPressed: boolean;
    subscription: Subscription;
    timerStarted: boolean;
}
