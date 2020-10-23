import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

// class that allows to redo-undo pencil-brush-eraser tool
export class StrokeAction extends AbsUndoRedo {
    // couleur finale = couleur du stroke
    // couleur initiale = avant le stroke dans le canvas (dans ) // use getcolor de colorservice
    constructor(
        private changes: Vec2[],
        private initColor: string,
        private thickness: number,
        private alpha: number,
        private pencilService: PencilService,
        private drawingService: DrawingService,
        private colorService: ColorService,
    ) {
        super();
    }

    // applies on the canvas the current elements
    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.initColor;
        this.drawingService.baseCtx.globalAlpha = this.alpha;
        this.colorService.changeColorOpacity(this.thickness);
        this.pencilService.drawLine(this.drawingService.baseCtx, this.changes);
        this.pencilService.clearEffectTool();
    }
}
