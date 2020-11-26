import { Injectable } from '@angular/core';
import { CanvasResizerService } from '../canvas/canvas-resizer.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    isGridSettingsChecked: boolean = false;
    opacity: number = 0; // 0 means transparent or DISABLED, 100 means you see nothing thru it
    squareWidth: number = 100; // the unit is in pixels

    constructor(private drawingService: DrawingService, private canvasResizerService: CanvasResizerService) {}

    getGridData(): ImageData {
        return this.drawingService.gridCtx.getImageData(0, 0, this.drawingService.gridCanvas.width, this.drawingService.gridCanvas.height);
    }

    activateGrid() {
        if (this.isGridSettingsChecked) {
            const ctx = this.drawingService.gridCtx;
            this.drawingService.clearCanvas(ctx);
            const w = this.canvasResizerService.canvasSize.x;
            const h = this.canvasResizerService.canvasSize.y;
            const nbOfVerticalLines = Math.ceil(w / this.squareWidth);
            const nbOfHorizontalLines = Math.ceil(h / this.squareWidth);
            ctx.fillStyle = '#000000'; // black lines
            // horizontal lines first
            for (let j = 0; j < nbOfHorizontalLines; ++j) {
                ctx.beginPath();
                ctx.moveTo(0, j * this.squareWidth);
                ctx.lineTo(w, j * this.squareWidth);
                ctx.closePath();
                ctx.stroke();
            }
            // then vertical lines
            for (let i = 0; i < nbOfVerticalLines; ++i) {
                ctx.beginPath();
                ctx.moveTo(i * this.squareWidth, 0);
                ctx.lineTo(i * this.squareWidth, h);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }

    // deactivating the grid means clearing it
    deactivateGrid() {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
    }
}
