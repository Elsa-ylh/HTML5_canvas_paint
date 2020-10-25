import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SubToolselected } from '../sub-tool-selected';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class RectangleAction extends AbsUndoRedo {
    constructor(
        private mousePosition: Vec2,
        private mouseDownCord: Vec2,
        private primaryColor: string,
        private secondaryColor: string,
        private lineWidth: number,
        private shiftPressed: boolean,
        private selectSubTool: SubToolselected,
        private canvasSelected: boolean,
        private rectangleService: RectangleService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply() {
        this.drawingService.baseCtx.strokeStyle = this.primaryColor;
        this.drawingService.baseCtx.shadowColor = this.secondaryColor;
        this.drawingService.baseCtx.lineWidth = this.lineWidth;
        this.rectangleService.selectRectangle(this.mousePosition, this.mouseDownCord, {
            primaryColor: this.primaryColor,
            secondaryColor: this.secondaryColor,
            lineWidth: this.lineWidth,
            shiftPressed: this.shiftPressed,
            selectSubTool: this.selectSubTool,
            canvasSelected: this.canvasSelected,
        });
        this.rectangleService.clearEffectTool();
    }
}
