import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class ResizeCanvas extends AbsUndoRedo {
    constructor(private canvasResize: CanvasResizerService, private resizeCanvasBefore: Vec2, private resizeCanvasAfter: Vec2) {
        super();
    }

    reapply(): void {
        // save the canvas size
        this.canvasResize.canvasSize = this.resizeCanvasAfter;
    }

    deapply(): void {
        this.canvasResize.canvasSize = this.resizeCanvasBefore;
    }
}
