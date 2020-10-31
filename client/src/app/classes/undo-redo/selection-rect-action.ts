import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';
import { Vec2 } from '../vec2';

export class SelectionRectAction extends AbsUndoRedo {
    constructor(
        private copyPosition: Vec2,
        private image: ImageData,
        private selectionRect: Vec2,
        private width: number,
        private height: number,
        private selectionRectService: SelectionRectangleService,
    ) {
        super();
    }
    apply(): void {
        this.selectionRectService.clearSelection(this.selectionRect, this.width, this.height);
        this.selectionRectService.pasteSelection(this.copyPosition, this.image);
    }
}
