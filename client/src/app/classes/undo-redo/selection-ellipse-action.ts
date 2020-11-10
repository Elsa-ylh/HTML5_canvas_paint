import { AbsUndoRedo } from '@app//classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';

export class SelectionEllipseAction extends AbsUndoRedo {
    constructor(
        private pastePosition: Vec2,
        private imageData: ImageData,
        private copyPosition: Vec2,
        private width: number,
        private height: number,
        private selectionEllService: SelectionEllipseService,
    ) {
        super();
    }

    apply(): void {
        let image = new Image();
        image.src = this.selectionEllService.getImageURL(this.imageData, this.width, this.height);
        this.selectionEllService.clearSelection(this.copyPosition, this.width, this.height);
        this.selectionEllService.pasteSelection(this.pastePosition, image, {x:this.width, y:this.height});
    }
}
