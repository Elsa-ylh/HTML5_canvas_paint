import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    constructor() {}

    listUndo: AbsUndoRedo[] = [];
    listRedo: AbsUndoRedo[] = [];

    // function that cancels the last modification
    redo(): void {
        if (this.listRedo.length > 0) {
            this.listRedo.push();
        }
    }

    // allows to reset the listUndo after we redo something.
    clearUndo(): void {
        this.listUndo = [];
    }

    // function that redoes the lastest modification. we push the lastest element removed from the undo list.
    undo(): void {
        if (this.listUndo.length > 0) {
            this.listUndo.push();
        }
    }
}
