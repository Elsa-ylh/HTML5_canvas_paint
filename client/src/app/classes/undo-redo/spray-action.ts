import { DrawingService } from '@app/services/drawing/drawing.service';
import { SprayService } from '@app/services/tools/spray.service';
import { Vec2 } from '../vec2';
import { AbsUndoRedo } from './abs-undo-redo';

export class SprayAction extends AbsUndoRedo {
    constructor(
        private density: number,
        private color: string,
        private zoneDiameter: number,
        private dropDiameter: number,
        private angle: number[],
        private radius: number[],
        private position: Vec2,
        private drawingService: DrawingService,
        private sprayService: SprayService,
    ) {
        super();
    }

    apply(): void {
        this.drawingService.baseCtx.lineJoin = this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.fillStyle = this.color;
        this.sprayService.transform(
            {
                density: this.density,
                color: this.color,
                zoneDiameter: this.zoneDiameter,
                dropDiameter: this.dropDiameter,
                angle: this.angle,
                radius: this.radius,
                position: this.position,
            },
            true,
        );
    }
}
