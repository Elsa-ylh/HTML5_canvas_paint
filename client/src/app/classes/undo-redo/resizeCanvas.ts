import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class ResizeCanvas extends AbsUndoRedo {
    constructor(private canvasResize: CanvasResizerService) {
        super();
    }
    resizeCanvasBefore: Vec2;
    reapply(): void {
        // save the canvas size
        this.resizeCanvasBefore = this.canvasResize.canvasSize;
    }

    deapply(): void {}
}
