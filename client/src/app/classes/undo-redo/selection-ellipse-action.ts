import { AbsUndoRedo } from '@app//classes/undo-redo/abs-undo-redo';
import { SelectionImage } from '@app/classes/selection';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';

export class SelectionEllipseAction extends AbsUndoRedo {
    private selection: SelectionImage;
    constructor(private selectionService: SelectionEllipseService, private drawingService: DrawingService, selection: SelectionImage) {
        super();
        this.selection = new SelectionImage(this.drawingService);
        this.selection.copyImageInitialPos = { x: selection.copyImageInitialPos.x, y: selection.copyImageInitialPos.y };
        this.selection.imagePosition = { x: selection.imagePosition.x, y: selection.imagePosition.y };
        this.selection.endingPos = { x: selection.endingPos.x, y: selection.endingPos.y };
        this.selection.imageSize = { x: selection.imageSize.x, y: selection.imageSize.y };
        this.selection.ellipseRad = { x: selection.ellipseRad.x, y: selection.ellipseRad.y };
        this.selection.width = selection.width;
        this.selection.height = selection.height;
        this.selection.imageData = selection.imageData;
        this.selection.image = new Image();
        this.selection.image.src = selection.image.src;
    }

    apply(): void {
        this.selectionService.selection.ellipseRad = { x: this.selection.ellipseRad.x, y: this.selection.ellipseRad.y };
        this.selectionService.clearSelection(this.selection.copyImageInitialPos, this.selection.width, this.selection.height);
        this.selectionService.pasteSelection(this.selection);
    }
}
