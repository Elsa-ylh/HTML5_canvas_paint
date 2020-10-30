import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
// import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-Canvas-Action';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { CanvasResizerService } from '../canvas/canvas-resizer.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    isundoDisabled: boolean = true; // to disactivate the option to redo-redo. diabled=true (cant undo-red0 when app loads)
    isRedoDisabled: boolean = true;
    isDefaultCanvasResizeInStack: boolean = false;
    private listUndo: AbsUndoRedo[] = [];
    private listRedo: AbsUndoRedo[] = [];
    constructor(private drawingService: DrawingService) {}
    // private cvsResizerService: CanvasResizerService
    // Controls the buttons of redo-undo
    onMouseUpActivateUndo(mouseEvent: MouseEvent): void {
        // there is one element
        if (this.listUndo.length > 0) {
            this.isundoDisabled = false;
            //   console.log('undo actif but');
        }
    }
    onMouseUpActivateRedo(mouseEvent: MouseEvent): void {
        // console.log(this.listRedo.length);
        // console.log(this.listRedo.length);
        if (this.listRedo.length > 0) {
            this.isRedoDisabled = false;
            // console.log('redo actif but');
        }
    }
    undoRedoDisabled(): void {
        this.isundoDisabled = true;
        this.isRedoDisabled = true;
    }

    // function that redoes the latest undo.
    redo(): void {
        if (this.listRedo.length > 0) {
            const action = this.listRedo.pop();
            if (action) {
                this.listUndo.push(action);
                action.apply(); // applies the action
            }
        }
    }

    // allows to reset the listUndo after we redo something.
    clearUndo(): void {
        this.listUndo = [];
    }
    // allows to reset the listRedo
    clearRedo(): void {
        this.listRedo = [];
    }

    // adds the latest  action to the undo stack.
    addUndo(action: AbsUndoRedo): void {
        this.listUndo.push(action);
        console.log('stack undo redo', this.listUndo);
    }

    // addUndo(resizeAction: ResizeCanvasAction): void {
    //     if (!this.isDefaultCanvasResizeInStack) {
    //         const undoRedoEvent = { offsetX: this.cvsResizerService.canvasSize.x, offsetY: this.cvsResizerService.canvasSize.y } as MouseEvent;
    //         const resizeCanvasAction = new ResizeCanvasAction(undoRedoEvent, resizeCtx, baseCanvas, this.resizeDirection, this);
    //         this.undoRedoService.addUndo(resizeCanvasAction);
    //     }
    // }

    // function that cancels the lastest modification.(ctrl z) we push the lastest element removed from the undo stack.
    async undo(): Promise<void> {
        const action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack

        if (action) {
            this.listRedo.push(action);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);

            console.log(this.listUndo);

            for (const element of this.listUndo) {
                element.apply();
            }
        }
    }
}
