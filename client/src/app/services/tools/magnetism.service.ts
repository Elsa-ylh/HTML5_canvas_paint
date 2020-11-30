import { Injectable } from '@angular/core';
import { PIXELMOVEMENT } from '@app/classes/arrow-info';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPoint, ControlPointName, CPSIZE } from '@app/classes/control-points';
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

    // the following 2 variables are for locking mouseMovement
    private isMouseMagnetValueSet: boolean = false;
    private ajustedPosition: Vec2 = { x: -1, y: -1 };

    private isFirstTimeArrow: boolean = true;

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
            case ControlPointName.bottomRight:
                return {
                    x: ajustedPosition.x,
                    y: ajustedPosition.y - selectionSize.y,
                };
            case ControlPointName.bottom:
                return {
                    x: ajustedPosition.x - selectionSize.x / 2,
                    y: ajustedPosition.y - selectionSize.y,
                };
            case ControlPointName.bottomLeft:
                return {
                    x: ajustedPosition.x - selectionSize.x,
                    y: ajustedPosition.y - selectionSize.y,
                };
            case ControlPointName.none:
        }
        return {} as Vec2;
    }

    // the following methods calculate where to adjust the xy position
    private calculateRemainder(squareWidth: number, calculatingPosition: Vec2, ajustedPosition: Vec2): void {
        const remainderX = calculatingPosition.x % squareWidth;
        if (remainderX <= squareWidth / 2) this.ajustedPosition.x = calculatingPosition.x - remainderX;
        else this.ajustedPosition.x = calculatingPosition.x - remainderX + squareWidth;

        const remainderY = calculatingPosition.y % squareWidth;
        if (remainderY <= squareWidth / 2) this.ajustedPosition.y = calculatingPosition.y - remainderY;
        else this.ajustedPosition.y = calculatingPosition.y - remainderY + squareWidth;
    }

    private applyFinalPosition(params: MagnetismParams): void {
        params.endingPosition.x = this.ajustedPosition.x + params.selectionSize.x;
        params.endingPosition.y = this.ajustedPosition.y + params.selectionSize.y;

        params.imagePosition.x = this.ajustedPosition.x;
        params.imagePosition.y = params.endingPosition.y - params.selectionSize.y;
    }

    applyMagnetismMouseMove(params: MagnetismParams): MagnetismParams {
        if (this.isMagnetismActive) {
            const squareWidth = this.gridService.squareWidth;
            const controlPoint = params.controlGroup.controlPoints.get(params.controlGroup.controlPointName) as ControlPoint;

            if (!this.isMouseMagnetValueSet) {
                this.isMouseMagnetValueSet = true;

                const calculatingPosition = controlPoint.position;

                this.calculateRemainder(squareWidth, calculatingPosition, this.ajustedPosition);

                this.ajustedPosition = this.convertCalculatingPosition(
                    this.ajustedPosition,
                    params.controlGroup.controlPointName,
                    params.selectionSize,
                );
            }

            this.applyFinalPosition(params);

            params.controlGroup.setPositions(params.imagePosition, params.endingPosition, params.selectionSize);
            return {
                imagePosition: params.imagePosition,
                endingPosition: params.endingPosition,
                controlGroup: params.controlGroup,
            } as MagnetismParams;
        }
        return { imagePosition: params.imagePosition, endingPosition: params.endingPosition, controlGroup: params.controlGroup } as MagnetismParams;
    }

    applyMagnetismArrowKey(params: MagnetismParams, arrowDirection: Vec2): MagnetismParams {
        if (this.isMagnetismActive) {
            const squareWidth = this.gridService.squareWidth;
            const controlPoint = params.controlGroup.controlPoints.get(params.controlGroup.controlPointName) as ControlPoint;

            if (this.isFirstTimeArrow) {
                this.isFirstTimeArrow = false;

                const calculatingPosition = controlPoint.position;

                this.calculateRemainder(squareWidth, calculatingPosition, this.ajustedPosition);

                this.ajustedPosition = this.convertCalculatingPosition(
                    this.ajustedPosition,
                    params.controlGroup.controlPointName,
                    params.selectionSize,
                );

                this.applyFinalPosition(params);
            } else {
                const calculatingPosition = controlPoint.position;

                this.ajustedPosition.x = calculatingPosition.x + (arrowDirection.x / PIXELMOVEMENT) * squareWidth + CPSIZE / 2;
                this.ajustedPosition.y = calculatingPosition.y + (arrowDirection.y / PIXELMOVEMENT) * squareWidth + CPSIZE / 2;

                this.ajustedPosition = this.convertCalculatingPosition(
                    this.ajustedPosition,
                    params.controlGroup.controlPointName,
                    params.selectionSize,
                );

                params.endingPosition.x = this.ajustedPosition.x + params.selectionSize.x;
                params.endingPosition.y = this.ajustedPosition.y + params.selectionSize.y;

                params.imagePosition.x = this.ajustedPosition.x;
                params.imagePosition.y = params.endingPosition.y - params.selectionSize.y;
            }

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
        this.isMouseMagnetValueSet = false;
        this.isFirstTimeArrow = true;
        this.ajustedPosition = { x: -1, y: -1 };
    }
}
