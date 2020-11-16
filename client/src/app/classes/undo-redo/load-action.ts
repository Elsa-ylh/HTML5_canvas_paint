import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeDirection } from '../resize-direction';

export class LoadAction extends AbsUndoRedo {
    constructor(
        private picture: CanvasImageSource,
        private height: number, // to get size of drawing
        private width: number,
        private drawingService: DrawingService,
        private canvasResizerService: CanvasResizerService,
    ) {
        super();
    }
    getHeight(): number {
        return this.height;
    }
    getWidth(): number {
        return this.width;
    }

    async apply(): Promise<void> {
        this.canvasResizerService.canvasSize.x = this.width;
        this.canvasResizerService.canvasSize.y = this.height;
        let event = { offsetX: this.width, offsetY: this.height } as MouseEvent;
        this.canvasResizerService.resizeDirection = ResizeDirection.verticalAndHorizontal;
        this.canvasResizerService.onResize(event, this.drawingService.baseCtx);
    }
    applyImage(): void {
        this.drawingService.baseCtx.drawImage(this.picture, 0, 0);
    }
}
