import { Injectable } from '@angular/core';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
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
        const squareWidth = this.gridService.squareWidth;
        console.log(params);
    }
}
