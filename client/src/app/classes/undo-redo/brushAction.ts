import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush.service';
import { SubToolselected } from '../sub-tool-selected';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class BrushAction extends AbsUndoRedo {
    constructor(
        private changesBrush: Vec2[],
        // private brushPointData: PointArc[],
        private primaryColor: string,
        private secondaryColor: string,
        private thicknessBursh: number,
        private selectedBrushTool: SubToolselected,
        private brushService: BrushService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply() {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.shadowColor = this.secondaryColor;
        this.drawingService.baseCtx.lineWidth = this.thicknessBursh;
        this.brushService.drawLine(this.drawingService.baseCtx, this.changesBrush, this.selectedBrushTool);
        this.brushService.witchBrush(this.selectedBrushTool);
        this.brushService.clearEffectTool();
    }
}
