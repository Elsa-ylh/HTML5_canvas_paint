import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    isUndoDisabled: boolean = true; // to disactivate the option to redo-redo. diabled=true (cant undo-red0 when app loads)
    isRedoDisabled: boolean = true;
    defaultCanvasAction: ResizeCanvasAction; // will be instanciated when canvas is ngAfterViewInit
    private listUndo: AbsUndoRedo[] = [];
    private listRedo: AbsUndoRedo[] = [];

    constructor(private drawingService: DrawingService) {}

    redo(): void {
        if (this.listRedo.length > 0) {
            const action = this.listRedo.pop();
            if (action) {
                this.listUndo.push(action);
                action.apply(); // applies the action
            }
        }
        this.updateStatus();
    }

    // allows to reset the listUndo after we redo something.
    clearUndo(): void {
        this.listUndo = [];
        this.updateStatus();
    }
    // allows to reset the listRedo
    clearRedo(): void {
        this.listRedo = [];
        this.updateStatus();
    }

    // adds the latest  action to the undo stack.
    addUndo(action: AbsUndoRedo): void {
        this.listUndo.push(action);
        this.updateStatus();
    }
    // function that cancels the lastest modification.(ctrl z) we push the lastest element removed from the undo stack.
    async undo(): Promise<void> {
        const action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack
        if (action) {
            this.listRedo.push(action);
            const listOfResize: AbsUndoRedo[] = [];

            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            // reapply the currents elements (without the removed one)
            for (const element of this.listUndo) {
                if (element instanceof ResizeCanvasAction) {
                    listOfResize.push(element);
                } else {
                    element.apply();
                }
            }

            if (listOfResize.length === 0) {
                this.defaultCanvasAction.apply();
            } else {
                listOfResize[listOfResize.length - 1].apply();
            }
        }
        this.updateStatus();
        // this.automaticSaveSer.save();
    }

    // Controls the buttons of redo-undo
    updateStatus(): void {
        this.isRedoDisabled = this.listRedo.length === 0;
        this.isUndoDisabled = this.listUndo.length === 0;
    }

    // deactivate the buttons when drawing on the canvas
    whileDrawingUndoRedo(event: MouseEvent): void {
        this.isUndoDisabled = true;
        this.isRedoDisabled = true;
    }

    activateUndo(event: MouseEvent): void {
        this.isUndoDisabled = false;
    }
}
