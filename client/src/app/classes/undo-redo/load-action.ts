import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class LoadAction extends AbsUndoRedo {
    constructor(
        private picture: CanvasImageSource,
        private height: number,
        private width: number,
        private drawingService: DrawingService,
        private canvasResizerService: CanvasResizerService,
    ) {
        super();
    }

    apply(): void {
        this.canvasResizerService.canvasSize.x = this.width;
        this.canvasResizerService.canvasSize.y = this.height;
        this.drawingService.baseCtx.drawImage(this.picture, 0, 0);
    }
}
