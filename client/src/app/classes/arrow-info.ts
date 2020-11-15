import { Subscription } from 'rxjs';

const PIXELMOUVEMENT = 3;
const MOUVEMENTDELAY = 100;
export class ArrowInfo {

  constructor() {
    this.arrowPressed = false;
    this.timerStarted = false;

  }

  arrowPressed: boolean;
  subscription: Subscription;
  timerStarted: boolean;
}
