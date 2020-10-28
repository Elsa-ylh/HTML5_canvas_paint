import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
//import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
// class that allows to undo and redo resize of the canvas
export class ResizeCanvasAction extends AbsUndoRedo {
    constructor() //   private resizeCanvasEvent: MouseEvent,
    //   private sizeCtx: CanvasRenderingContext2D,
    //   private baseCanvas: HTMLCanvasElement,
    //   private resizeDirection: ResizeDirection,
    //   private canvasResizerService: CanvasResizerService,
    {
        super();
    }

    apply(): void {
        // console.log('apply resize');
        // this.resizeCanvasEvent;
        // this.sizeCtx;
        // this.baseCanvas;
        // this.resizeDirection;
        //  this.canvasResizerService.onResizeDown(this.resizeCanvasEvent, this.resizeDirection);
        //  this.canvasResizerService.onResizeUp(this.resizeCanvasEvent, this.sizeCtx, this.baseCanvas);
    }
}
