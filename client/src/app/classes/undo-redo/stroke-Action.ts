import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';

// class that allows to redo-undo pencil-brush-eraser tool
export class StrokeAction extends AbsUndoRedo {
    // couleur finale = couleur du stroke
    // couleur initiale = avant le stroke dans le canvas (dans ) // use getcolor de colorservice
    constructor(
        private changes: Vec2[],
        private colorPencil: string,
        private thickness: number,
        private alpha: number,
        private pencilService: PencilService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    // applies on the canvas the current elements
    apply(): void {
        //  console.log('apply pencil');
        //  console.log(this.changes);
        debugger;
        this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.lineJoin = 'round';
        this.drawingService.baseCtx.strokeStyle = this.colorPencil;
        // this.colorService.changeColorOpacity(this.alpha);
        this.drawingService.baseCtx.globalAlpha = this.alpha;
        this.drawingService.baseCtx.lineWidth = this.thickness;
        this.pencilService.drawLine(this.drawingService.baseCtx, this.changes);
        this.pencilService.clearEffectTool();
    }
}
