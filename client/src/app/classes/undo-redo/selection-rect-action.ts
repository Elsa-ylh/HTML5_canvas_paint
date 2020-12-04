import { SelectionImage } from '@app/classes/selection';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';

export class SelectionRectAction extends AbsUndoRedo {
    private selection: SelectionImage;
    constructor(private selectionService: SelectionRectangleService, private drawingService: DrawingService, selection: SelectionImage) {
        super();
        this.selection = new SelectionImage(this.drawingService);
        this.selection.copyImageInitialPos = { x: selection.copyImageInitialPos.x, y: selection.copyImageInitialPos.y };
        this.selection.imagePosition = { x: selection.imagePosition.x, y: selection.imagePosition.y };
        this.selection.endingPos = { x: selection.endingPos.x, y: selection.endingPos.y };
        this.selection.imageSize = { x: selection.imageSize.x, y: selection.imageSize.y };
        this.selection.width = selection.width;
        this.selection.height = selection.height;
        this.selection.imageData = selection.imageData;
        this.selection.image = new Image();
        this.selection.image.src = selection.image.src;
    }

    apply(): void {
        this.selectionService.clearSelection(this.selection.copyImageInitialPos, this.selection.width, this.selection.height);
        this.selectionService.pasteSelection(this.selection);
    }
}
