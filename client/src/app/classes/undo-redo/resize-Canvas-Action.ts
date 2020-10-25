import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
// class that allows to undo and redo resize of the canvas
export class ResizeCanvasAction extends AbsUndoRedo {
    constructor(private canvasResize: CanvasResizerService, private resizeCanvasBefore: Vec2, private resizeCanvasAfter: Vec2) {
        super();
    }

    apply(): void {
        // save the canvas size
        this.canvasResize.canvasSize = this.resizeCanvasAfter;
        this.canvasResize.canvasSize = this.resizeCanvasBefore;
    }
}
