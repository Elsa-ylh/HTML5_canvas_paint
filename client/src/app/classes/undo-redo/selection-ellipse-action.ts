import { AbsUndoRedo } from '@app//classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';

export class SelectionEllipseAction extends AbsUndoRedo {
    private image: HTMLImageElement = new Image();

    constructor(
        private pastePosition: Vec2,
        private imageData: ImageData,
        private copyPosition: Vec2,
        private width: number,
        private height: number,
        private selectionEllService: SelectionEllipseService,
        private ellipseRad: Vec2,
    ) {
        super();
        this.image.src = this.selectionEllService.getImageURL(this.imageData, this.width, this.height);
    }

    apply(): void {
        this.image = new Image();
        this.image.src = this.selectionEllService.getImageURL(this.imageData, this.width, this.height);
        this.selectionEllService.ellipseRad = this.ellipseRad;
        console.log(this.ellipseRad);
        this.selectionEllService.clearSelection(this.copyPosition, this.width, this.height);
        this.selectionEllService.pasteSelection(this.pastePosition, this.image, { x: this.width, y: this.height });
    }
}
