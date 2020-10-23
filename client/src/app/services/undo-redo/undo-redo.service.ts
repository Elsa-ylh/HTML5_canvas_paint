import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { ColorService } from '../color/color.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    isundoDisabled: boolean = true; // to disactivate the option to redo-redo. diabled=true (cant undo-red0 when app loads)
    isRedoDisabled: boolean = true;
    private listUndo: AbsUndoRedo[] = []; // FIFo
    private listRedo: AbsUndoRedo[] = []; // LIFO
    constructor(private drawingService: DrawingService, private colorService: ColorService) {}
    //Controls the buttons of redo-undo
    onMouseUpActivate(mouseEvent: MouseEvent): void {
        // there is one element
        if (this.listUndo.length > 0) {
            this.isundoDisabled = false;
        } else if (this.listRedo.length > 0) {
            this.isRedoDisabled = false;
        }
    }
    onMouseDownActivate(mouseEvent: MouseEvent): void {
        this.isundoDisabled = true;
        this.isRedoDisabled = true;
    }
    undoRedoDisabled(): void {
        this.isundoDisabled = true;
        this.isRedoDisabled = true;
    }

    // function that redoes the latest undo.
    redo(): void {
        if (this.listRedo.length > 0) {
            const action = this.listRedo.pop();
            if (action) {
                this.listUndo.push(action);
                action.apply(); // applies the action
            }
        }
    }

    // allows to reset the listUndo after we redo something.
    clearUndo(): void {
        this.listUndo = [];
    }
    // allows to reset the listRedo
    clearRedo(): void {
        this.listRedo = [];
    }

    // adds the latest  action to the undo stack.
    addUndo(action: AbsUndoRedo): void {
        this.listUndo.push(action);
    }
    // function that cancels the lastest modification.(ctrl z) we push the lastest element removed from the undo stack.
    undo(): void {
        const action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack
        if (action) {
            this.listRedo.push(action); // save into redo to be able to cancel the undo.
            // allows to return to the previous "live" state on the canvas
            const tempColor = this.drawingService.baseCtx.strokeStyle;
            const tempAlpha = this.colorService.primaryColorTransparency;
            const tempThickness = this.drawingService.baseCtx.lineWidth;
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            // reapply the currents elements (without the removed one)
            for (let element of this.listUndo) {
                element.apply();
            }
            // allows to return to the previous "live" state on the canvas
            this.drawingService.baseCtx.strokeStyle = tempColor;
            this.colorService.changeColorOpacity(tempAlpha);
            this.drawingService.baseCtx.lineWidth = tempThickness;
        }
    }
}
