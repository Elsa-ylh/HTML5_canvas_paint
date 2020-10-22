import { ColorService } from '@app/services/color/color.service';
import { AbsUndoRedo } from './abs-undo-redo';

// class that allows to redo-undo pencil-brush-eraser tool
export class StrokeAction extends AbsUndoRedo {
    // couleur finale = couleur du stroke
    // couleur initiale = avant le stroke dans le canvas (dans ) // use getcolor de colorservice
    constructor(private changes: vec2[], coleurFinale: string, colorService: ColorService) {
        super();
    }

    reapply(): void {
        // couleur finale aux positions
    }

    deapply(): void {
        // couleur initiale (dans le tableau de tuple Vec2/string) aux positions
    }
}
