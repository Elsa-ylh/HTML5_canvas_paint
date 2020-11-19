import { DrawingService } from '@app/services/drawing/drawing.service';
import { FeatherService } from '@app/services/tools/feather.service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class FeatherAction extends AbsUndoRedo {
    constructor(
        private changesFeather: Vec2[],
        private primaryColor: string,
        private drawingService: DrawingService,
        private featherService: FeatherService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.featherService.drawFeather(this.drawingService.baseCtx, this.changesFeather);
    }
}
