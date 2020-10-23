import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    isundoRedoDisabled: boolean = true; // to disactivate the option to redo-redo. diabled=true (cant undo-red0 when app loads)
    private listUndo: AbsUndoRedo[] = []; // FIFo
    private listRedo: AbsUndoRedo[] = []; // LIFO
    constructor(private drawingService: DrawingService) {}

    onMouseUpActivate(mouseEvent: MouseEvent): void {
        // there is one element
        if (this.listUndo.length > 0 || this.listRedo.length > 0) {
            this.isundoRedoDisabled = false;
        }
    }
    onMouseDownActivate(mouseEvent: MouseEvent): void {
        this.isundoRedoDisabled = true;
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
        //this.listUndo.unshift(action); // push at pos 0 the newest element
        this.listUndo.push(action);
    }
    // function that cancels the lastest modification.(ctrl z) we push the lastest element removed from the undo stack.
    undo(): void {
        // list has an element

        const action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack
        if (action) {
            // console.log(this.listUndo);
            ///  const action = this.listUndo[this.listUndo.length - 1];
            //  this.listUndo.splice(-1, 1);
            //  console.log(this.listUndo);
            this.listRedo.push(action); // save into redo to be able to cancel the undo.
            const tempColor = this.drawingService.baseCtx.strokeStyle;
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            for (let element of this.listUndo) {
                element.apply();
            }
            this.drawingService.baseCtx.strokeStyle = tempColor;
        }
    }
}
