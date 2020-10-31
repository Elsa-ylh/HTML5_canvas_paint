import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    isundoDisabled: boolean = true; // to disactivate the option to redo-redo. diabled=true (cant undo-red0 when app loads)
    isRedoDisabled: boolean = true;
    defaultCanvasAction: ResizeCanvasAction; // will be instanciated when canvas is ngAfterViewInit
    private listUndo: AbsUndoRedo[] = [];
    private listRedo: AbsUndoRedo[] = [];
    constructor(private drawingService: DrawingService) {}
    // Controls the buttons of redo-undo
    onMouseUpActivateUndo(mouseEvent: MouseEvent): void {
        // there is one element
        if (this.listUndo.length > 0) {
            this.isundoDisabled = false;
        }
    }
    onMouseUpActivateRedo(mouseEvent: MouseEvent): void {
        if (this.listRedo.length > 0) {
            this.isRedoDisabled = false;
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
    }

    // function that cancels the lastest modification.(ctrl z) we push the lastest element removed from the undo stack.
    undo(): void {
        const action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack

        if (action) {
            this.listRedo.push(action);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);

            console.log(this.listUndo);

            let listOfResize: AbsUndoRedo[] = [];

            this.listRedo.push(action); // save into redo to be able to cancel the undo.
            // allows to return to the previous "live" state on the canvas
            // const tempPrimaryColor = this.drawingService.baseCtx.strokeStyle;
            // const tempSecondaryColor = this.drawingService.baseCtx.shadowColor;
            // const tempAlpha = this.colorService.primaryColorTransparency;
            // const tempThickness = this.drawingService.baseCtx.lineWidth;

            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            // reapply the currents elements (without the removed one)
            console.log('pile undo : undo fct', this.listUndo);
            console.log('pile redo : undo fct', this.listRedo);
            for (const element of this.listUndo) {
                if (element instanceof ResizeCanvasAction) {
                    listOfResize.push(element);
                } else {
                    element.apply();
                }
            }

            if (listOfResize.length == 0) {
                this.defaultCanvasAction.apply();
            } else {
                listOfResize[listOfResize.length - 1].apply();
            }
        }
    }
}
