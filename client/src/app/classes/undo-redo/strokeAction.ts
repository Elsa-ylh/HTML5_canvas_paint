import { PencilService } from '@app/services/tools/pencil-service';
import { AbsUndoRedo } from './abs-undo-redo';
// class that allows to redo-undo pencil-brush-eraser tool
export class StrokeAction extends AbsUndoRedo {
    constructor(private pencilService: PencilService, private lastMousePos: Event, private newMousePos: MouseEvent) {
        super();
    }

    reapply(): void {}

    deapply(): void {}
}
