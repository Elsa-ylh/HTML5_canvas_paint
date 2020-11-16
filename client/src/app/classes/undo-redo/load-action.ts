import { ResizeDirection } from '@app/classes/resize-direction';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

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

    async apply(): Promise<void> {
        const event = { offsetX: this.width, offsetY: this.height } as MouseEvent;
        this.canvasResizerService.resizeDirection = ResizeDirection.verticalAndHorizontal;
        this.canvasResizerService.onResize(event, this.drawingService.baseCtx);
        this.drawingService.baseCtx.drawImage(this.picture, 0, 0);
    }
}
