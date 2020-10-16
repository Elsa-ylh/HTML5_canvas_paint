import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    constructor() {}

    private listUndo: AbsUndoRedo[] = [];
    private listRedo: AbsUndoRedo[] = []; // LIFO

    // function that redoes the latest undo.
    redo(): void {
        if (this.listRedo.length > 0) {
            let action = this.listRedo.pop();
            if (action) {
                this.listUndo.push(action);
                action.reapply(); // applies the action
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
        if (this.listUndo.length > 0) {
            // list has an element
            let action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack
            if (action) {
                this.listRedo.push(action); // save into redo to be able to cancel the undo.
                action.deapply(); // deapplies the action
            }
        }
    }
}
