import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
export const FIFTEEN = 15;
export const ONE = 1;

@Injectable({
    providedIn: 'root',
})
export class RotationService extends Tool {
    altPressed: boolean = false;
    isWheelAdd: boolean = false;
    rotationAngle: number = 0;
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    rotate(): void {
        // rotate logic. translate and rotate.
    }

    changeAngleWithScroll(): void {
        if (this.isWheelAdd) {
            if (!this.altPressed) {
                this.rotationAngle += FIFTEEN;
            } else {
                this.rotationAngle += ONE;
            }
        } else {
            if (!this.altPressed) {
                this.rotationAngle -= FIFTEEN;
            } else {
                this.rotationAngle -= ONE;
            }
        }
    }

    addOrRetract(event: WheelEvent): void {
        // scroll up => wheel adds to the angle (same as when scrolling up a page.)
        // if the value of deltaY is <0 that means we are scrooling up
        if (event.deltaY < 0) {
            this.isWheelAdd = true;
        } else {
            this.isWheelAdd = false;
        }
    }
}
