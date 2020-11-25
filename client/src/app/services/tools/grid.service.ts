import { Injectable } from '@angular/core';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    // private opacity: number = 0; // 0 means transparent or DISABLED, 100 means you see nothing thru it
    // private squareWidth: number = 10; // the unit is in pixels

    constructor(private drawingService: DrawingService) {}

    activateGrid() {
        const ctx = this.drawingService.gridCtx;
        const w = this.drawingService.gridCanvas.width;
        const h = this.drawingService.gridCanvas.height;
        ctx.fillStyle = '#000000';
        for (let i = 0; i < w; ++i) {
            for (let j = 0; j < h; ++j) {}
        }
        ctx.moveTo(0, 0);
        ctx.lineTo(10, 0);
        ctx.lineTo(10, 10);
        ctx.lineTo(0, 10);
        ctx.lineTo(0, 0);
        ctx.stroke();
    }

    // deactivating the grid means clearing it
    deactivateGrid() {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
    }
}
