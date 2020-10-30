import { ResizeDirection } from '@app/classes/resize-direction';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
// class that allows to undo and redo resize of the canvas
export class ResizeCanvasAction extends AbsUndoRedo {
    constructor(
        private event: MouseEvent,
        private resizeCtx: CanvasRenderingContext2D,
        private baseCanvas: HTMLCanvasElement,
        private resizeDirection: ResizeDirection,
        private cvsResizerService: CanvasResizerService,
    ) {
        super();
    }

    apply(): void {
        debugger;
        this.cvsResizerService.isResizeDown = true;
        this.cvsResizerService.resizeDirection = this.resizeDirection;
        this.cvsResizerService.onResizeUp(this.event, this.resizeCtx, this.baseCanvas);
    }
}
