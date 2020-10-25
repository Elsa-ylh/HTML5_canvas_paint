import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { ToolGeneralInfo } from '../toolGeneralInfo';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class RectangleAction extends AbsUndoRedo {
    constructor(
        private mousePosition: Vec2,
        private mouseDownCord: Vec2,
        private generalInfo: ToolGeneralInfo,
        private rectangleService: RectangleService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply() {
        this.drawingService.baseCtx.strokeStyle = this.generalInfo.primaryColor;
        this.drawingService.baseCtx.shadowColor = this.generalInfo.secondaryColor;
        this.drawingService.baseCtx.lineWidth = this.generalInfo.lineWidth;
        this.rectangleService.selectRectangle(this.mousePosition, this.mouseDownCord, this.generalInfo);
        this.rectangleService.clearEffectTool();
    }
}
