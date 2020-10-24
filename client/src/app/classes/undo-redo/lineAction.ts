import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';
import { SubToolselected } from '../sub-tool-selected';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class LineAction extends AbsUndoRedo {
    constructor(
        private changesLine: Vec2[],
        private pointMouse: Vec2,
        private colorLine: string,
        private thickness: number,
        private secondaryTickness: number,
        private lineService: LineService,
        private drawingService: DrawingService,
        private subToolselected: SubToolselected,
    ) {
        super();
    }

    apply() {
        console.log('apply line');
        this.drawingService.baseCtx.strokeStyle = this.colorLine;
        this.drawingService.baseCtx.lineWidth = this.thickness;
        this.lineService.drawLine(this.drawingService.baseCtx, this.changesLine, this.thickness);
        this.lineService.drawPoint(this.drawingService.baseCtx, this.changesLine, this.secondaryTickness);
        this.lineService.drawLineLastPoint(this.drawingService.baseCtx, this.changesLine, this.pointMouse);
        this.lineService.clearEffectTool();
    }
}
