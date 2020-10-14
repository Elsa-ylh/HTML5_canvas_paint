import { Injectable } from '@angular/core';
import { cursorName } from '@app/classes/cursor-name';
import { Tool, ToolUsed } from '@app/classes/tool';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    dropperCtx: CanvasRenderingContext2D;

    whichTools: ToolUsed = ToolUsed.Pencil;
    currentTool: Tool;
    cursorUsed: string = cursorName.default;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // returns true if every pixel's uint32 representation is 0 (or "blank")
    isCanvasBlank(): boolean {
        const pixelBuffer = new Uint32Array(this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height).data.buffer);
        return !pixelBuffer.some((color) => color !== 0);
    }
}
