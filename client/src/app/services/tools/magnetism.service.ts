import { Injectable } from '@angular/core';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPoint } from '@app/classes/control-points';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';

export interface MagnetismParams {
    imagePosition: Vec2;
    endingPosition: Vec2;
    controlGroup: ControlGroup;
    selectionSize: Vec2;
}

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    isMagnetismActive: boolean = false;

    // the following 4 variables are for locking mouseMovement
    private isMagnetActive: boolean = false;
    private xPos: number = -1;
    private yPos: number = -1;

    constructor(private gridService: GridService) {}

    applyMagnetism(params: MagnetismParams): MagnetismParams {
        const squareWidth = this.gridService.squareWidth;
        const controlPoint = params.controlGroup.controlPoints.get(params.controlGroup.controlPointName) as ControlPoint;

        if (!this.isMagnetActive) {
            this.isMagnetActive = true;

            const remainderX = params.imagePosition.x % squareWidth;
            if (remainderX <= squareWidth / 2) this.xPos = params.imagePosition.x - remainderX;
            else this.xPos = params.imagePosition.x - remainderX + squareWidth;

            const remainderY = params.imagePosition.y % squareWidth;
            if (remainderY <= squareWidth / 2) this.yPos = params.imagePosition.y - remainderY;
            else this.yPos = params.imagePosition.y - remainderY + squareWidth;
        }

        params.endingPosition.x = this.xPos + params.selectionSize.x;
        params.endingPosition.y = this.yPos + params.selectionSize.y;

        params.imagePosition.x = this.xPos;
        params.imagePosition.y = params.endingPosition.y - params.selectionSize.y;

        params.controlGroup.setPositions(params.imagePosition, params.endingPosition, params.selectionSize);
        return { imagePosition: controlPoint.position, endingPosition: params.endingPosition, controlGroup: params.controlGroup } as MagnetismParams;
    }

    resetMagnetism(): void {
        this.isMagnetActive = false;
        this.xPos = -1;
        this.yPos = -1;
    }
}
