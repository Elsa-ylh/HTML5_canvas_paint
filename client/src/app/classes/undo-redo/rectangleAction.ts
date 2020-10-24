import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class RectangleAction extends AbsUndoRedo {
    constructor(
        private changesRect: Vec2,
        private base: boolean,
        private rectangleService: RectangleService,
        private drawingService: DrawingService,
    ) {
        super();
    }

    apply() {
        

    }
}
