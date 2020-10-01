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

    clearEffectTool(): void {
        this.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.baseCtx.strokeStyle = '#000000'; // to draw after erasing
        this.previewCtx.strokeStyle = '#000000';
        this.baseCtx.lineJoin = 'miter';
        this.baseCtx.lineCap = 'square';
        this.previewCtx.lineJoin = 'miter';
        this.previewCtx.lineCap = 'square';
        this.baseCtx.setLineDash([0, 0]); // reset
        this.previewCtx.setLineDash([0, 0]);
        this.baseCtx.globalAlpha = 1;
        this.previewCtx.globalAlpha = 1;
    }
}
