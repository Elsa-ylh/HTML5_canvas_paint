import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class SelectionEllipseAction extends AbsUndoRedo {
    constructor(
        private copyPosition: Vec2,
        private selectionMove: Vec2,
        private image: HTMLImageElement,
        private selectionRect: Vec2,
        private width: number,
        private height: number,
        private selectionEllService: SelectionEllipseService,
    ) {
        super();
    }

    apply(): void {
        this.selectionEllService.clearSelection(this.selectionRect, this.width, this.height);
        this.selectionEllService.pasteSelection(this.copyPosition, this.selectionMove, this.image);
    }
}
