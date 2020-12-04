import { Injectable } from '@angular/core';
import { SelectionImage } from '@app/classes/selection';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
const FIFTEEN: number = 15;
const ONE: number = 1;
const ONEHUNDREDEIGHTY: number = 180;

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

    rotateSelection(selection: SelectionImage, ctx: CanvasRenderingContext2D): void {
        const angleEnRadiant = (this.rotationAngle * Math.PI) / ONEHUNDREDEIGHTY;
        ctx.translate(selection.imagePosition.x + selection.width / 2, selection.imagePosition.y + selection.height / 2);
        ctx.rotate(angleEnRadiant);
        ctx.translate(-selection.imagePosition.x - selection.width / 2, -selection.imagePosition.y - selection.height / 2);
    }

    resetAngle(): void {
        this.rotationAngle = 0;
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
