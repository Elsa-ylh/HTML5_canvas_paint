import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class EraseAction extends AbsUndoRedo {
    constructor(
        private changes: Vec2[],
        private color: string,
        private thickness: number,
        private eraserService: EraserService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.color;
        this.drawingService.baseCtx.lineWidth = this.thickness;
        this.eraserService.removeLine(this.drawingService.baseCtx, this.changes);
        this.eraserService.clearEffectTool();
        console.log('called apply of eraser');
    }
}
