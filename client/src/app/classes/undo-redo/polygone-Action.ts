import { SubToolselected } from '@app/classes/sub-tool-selected';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygonService } from '@app/services/tools/polygon.service';

export class PolygoneAction extends AbsUndoRedo {
    constructor(
        private mousePosition: Vec2,
        private mouseDownCord: Vec2,
        private primaryColor: string,
        private secondaryColor: string,
        private lineWidth: number,
        private shiftPressed: boolean,
        private selectSubTool: SubToolselected,
        private canvasSelected: boolean,
        private PolygoneService: PolygonService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.shadowColor = this.secondaryColor;
        this.drawingService.baseCtx.lineWidth = this.lineWidth;



        this.PolygoneService.clearEffectTool();
    }
}
