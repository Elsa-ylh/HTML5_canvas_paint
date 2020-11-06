import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';

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