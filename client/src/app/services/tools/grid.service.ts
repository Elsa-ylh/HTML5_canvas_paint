import { Injectable } from '@angular/core';
import { CanvasResizerService } from '../canvas/canvas-resizer.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    // private opacity: number = 0; // 0 means transparent or DISABLED, 100 means you see nothing thru it
    private squareWidth: number = 50; // the unit is in pixels

    constructor(private drawingService: DrawingService, private canvasResizerService: CanvasResizerService) {}

    activateGrid() {
        const ctx = this.drawingService.gridCtx;
        console.log(this.canvasResizerService.canvasSize);
        const w = this.canvasResizerService.canvasSize.x;
        const h = this.canvasResizerService.canvasSize.y;
        const nbOfHorizontalSquares = Math.ceil(w / this.squareWidth);
        const nbOfVerticalSquares = Math.ceil(h / this.squareWidth);
        console.log(nbOfHorizontalSquares);
        console.log(nbOfVerticalSquares);
        ctx.fillStyle = '#000000'; // black lines
        // horizontal lines first
        for (let j = 0; j < nbOfVerticalSquares; ++j) {
            ctx.moveTo(0, j * this.squareWidth);
            ctx.lineTo(w, j * this.squareWidth);
            ctx.stroke();
        }
        // then vertical lines
        for (let i = 0; i < nbOfHorizontalSquares; ++i) {
            ctx.moveTo(i * this.squareWidth, 0);
            ctx.lineTo(i * this.squareWidth, h);
            ctx.stroke();
        }
    }

    // deactivating the grid means clearing it
    deactivateGrid() {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
    }
}
