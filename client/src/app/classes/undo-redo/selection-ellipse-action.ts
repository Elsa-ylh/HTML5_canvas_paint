import { AbsUndoRedo } from '@app//classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';

export class SelectionEllipseAction extends AbsUndoRedo {
    constructor(
        private copyPosition: Vec2,
        private image: HTMLImageElement,
        private width: number,
        private height: number,
        private selectionEllService: SelectionEllipseService,
    ) {
        super();
    }

    apply(): void {
        this.selectionEllService.clearSelection(this.copyPosition, this.width, this.height);
        this.selectionEllService.pasteSelection(this.copyPosition, this.image);
    }
}
