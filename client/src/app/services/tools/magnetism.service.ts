import { Injectable } from '@angular/core';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPoint, ControlPointName } from '@app/classes/control-points';
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
    private isMagnetValueSet: boolean = false;
    private ajustedPosition: Vec2 = { x: -1, y: -1 };

    constructor(private gridService: GridService) {}

    // we need to bring it back for image position compatible
    private convertCalculatingPosition(ajustedPosition: Vec2, controlPointname: ControlPointName, selectionSize: Vec2): Vec2 {
        switch (controlPointname) {
            case ControlPointName.topLeft:
                return ajustedPosition;
            case ControlPointName.top:
                return {
                    x: ajustedPosition.x - selectionSize.x / 2,
                    y: ajustedPosition.y,
                };
            case ControlPointName.topRight:
                return {
                    x: ajustedPosition.x - selectionSize.x,
                    y: ajustedPosition.y,
                };
            case ControlPointName.left:
                return {
                    x: ajustedPosition.x,
                    y: ajustedPosition.y - selectionSize.y / 2,
                };
            case ControlPointName.right:
                return {
                    x: ajustedPosition.x - selectionSize.x,
                    y: ajustedPosition.y - selectionSize.y / 2,
                };
            case ControlPointName.bottomLeft:
                return {
                    x: ajustedPosition.x,
                    y: ajustedPosition.y - selectionSize.y,
                };
            case ControlPointName.bottom:
                return {
                    x: ajustedPosition.x - selectionSize.x / 2,
                    y: ajustedPosition.y - selectionSize.y,
                };
            case ControlPointName.bottomRight:
                return {
                    x: ajustedPosition.x - selectionSize.x,
                    y: ajustedPosition.y - selectionSize.y,
                };
            case ControlPointName.none:
        }
        return {} as Vec2;
    }

    applyMagnetism(params: MagnetismParams): MagnetismParams {
        if (this.isMagnetismActive) {
            const squareWidth = this.gridService.squareWidth;
            debugger;
            const controlPoint = params.controlGroup.controlPoints.get(params.controlGroup.controlPointName) as ControlPoint;

            console.log(params.controlGroup.controlPoints);

            if (!this.isMagnetValueSet) {
                this.isMagnetValueSet = true;

                let calculatingPosition = controlPoint.position;
                console.log(calculatingPosition);

                const remainderX = calculatingPosition.x % squareWidth;
                if (remainderX <= squareWidth / 2) this.ajustedPosition.x = calculatingPosition.x - remainderX;
                else this.ajustedPosition.x = calculatingPosition.x - remainderX + squareWidth;

                const remainderY = calculatingPosition.y % squareWidth;
                if (remainderY <= squareWidth / 2) this.ajustedPosition.y = calculatingPosition.y - remainderY;
                else this.ajustedPosition.y = calculatingPosition.y - remainderY + squareWidth;

                console.log(this.ajustedPosition);

                this.ajustedPosition = this.convertCalculatingPosition(
                    this.ajustedPosition,
                    params.controlGroup.controlPointName,
                    params.selectionSize,
                );

                console.log(this.ajustedPosition);
            }

            params.endingPosition.x = this.ajustedPosition.x + params.selectionSize.x;
            params.endingPosition.y = this.ajustedPosition.y + params.selectionSize.y;

            params.imagePosition.x = this.ajustedPosition.x;
            params.imagePosition.y = params.endingPosition.y - params.selectionSize.y;

            params.controlGroup.setPositions(params.imagePosition, params.endingPosition, params.selectionSize);
            return {
                imagePosition: params.imagePosition,
                endingPosition: params.endingPosition,
                controlGroup: params.controlGroup,
            } as MagnetismParams;
        }
        return { imagePosition: params.imagePosition, endingPosition: params.endingPosition, controlGroup: params.controlGroup } as MagnetismParams;
    }

    resetMagnetism(): void {
        this.isMagnetValueSet = false;
        this.ajustedPosition = { x: -1, y: -1 };
    }
}
