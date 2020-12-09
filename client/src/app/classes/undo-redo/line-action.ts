import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';

export class LineAction extends AbsUndoRedo {
    constructor(
        private changesLine: Vec2[],
        private pointMouse: Vec2,
        private colorLine: string,
        private thickness: number,
        private secondaryTickness: number,
        private lineService: LineService,
        private drawingService: DrawingService,
        private subToolselected: SubToolSelected,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.colorLine;
        this.drawingService.baseCtx.lineWidth = this.thickness;
        this.lineService.drawLine(this.drawingService.baseCtx, { data: this.changesLine, selectedLineTool: this.subToolselected }, this.thickness);
        this.lineService.drawPoint(this.drawingService.baseCtx, this.changesLine, this.secondaryTickness);
        this.lineService.drawLineLastPoint(
            this.drawingService.baseCtx,
            { data: this.changesLine, selectedLineTool: this.subToolselected },
            this.pointMouse,
        );
        this.lineService.clearEffectTool();
    }
}
