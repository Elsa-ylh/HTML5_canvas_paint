import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';

export class SelectionAction extends AbsUndoRedo {
    constructor() {
        super();
    }
    apply(): void {}
}
