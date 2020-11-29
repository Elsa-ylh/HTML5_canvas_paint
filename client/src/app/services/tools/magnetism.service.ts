import { Injectable } from '@angular/core';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPoint, ControlPointName } from '@app/classes/control-points';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';

export interface MagnetismParams {
    imagePosition: Vec2;
    endingPosition: Vec2;
    controlPointName: ControlPointName;
    controlGroup: ControlGroup;
}

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    isMagnetismActive: boolean = false;

    constructor(private gridService: GridService) {}

    applyMagnetism(params: MagnetismParams): void {
        if (params.controlPointName !== ControlPointName.none) {
            debugger;
            const squareWidth = this.gridService.squareWidth;
            const controlPoint = params.controlGroup.controlPoints.get(params.controlPointName) as ControlPoint;
            const remainderX = controlPoint.position.x % squareWidth;
            const remainderY = controlPoint.position.y % squareWidth;

            if (remainderX <= remainderY) {
                if (remainderX <= squareWidth / 2) {
                    controlPoint.position.x -= remainderX;
                } else {
                    controlPoint.position.x = controlPoint.position.x - remainderX + squareWidth;
                }
            } else {
                if (remainderX <= squareWidth / 2) {
                    controlPoint.position.y -= remainderY;
                } else {
                    controlPoint.position.y = controlPoint.position.y - remainderY + squareWidth;
                }
            }
            params.imagePosition = (params.controlGroup.controlPoints.get(ControlPointName.topLeft) as ControlPoint).position;
            // params.endingPosition = (params.controlGroup.controlPoints.get(ControlPointName.bottomRight) as ControlPoint).position;
        }
    }
}
