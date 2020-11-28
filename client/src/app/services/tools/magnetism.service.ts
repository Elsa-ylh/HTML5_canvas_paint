import { Injectable } from '@angular/core';
import { GridService } from './grid.service';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    isMagnetismActive: boolean = false;

    constructor(private gridService: GridService) {}

    applyMagnetism(): void {
        console.log(this.gridService.squareWidth);
        // const squareWidth: ImageData = this.gridService.squareWidth;
        // const width: number = this.gridService.getGridData().width;
        // const height: number = this.gridService.getGridData().height;
    }
}
