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
    private listUndo: AbsUndoRedo[] = [];
    private listRedo: AbsUndoRedo[] = [];
    constructor(private drawingService: DrawingService, private colorService: ColorService) {}
    //Controls the buttons of redo-undo
    onMouseUpActivateUndo(mouseEvent: MouseEvent): void {
        // there is one element
        if (this.listUndo.length > 0) {
            this.isundoDisabled = false;
            //   console.log('undo actif but');
        } else if ((this.listUndo.length = 0)) {
            this.isundoDisabled = true;
        }
    }
    onMouseUpActivateRedo(mouseEvent: MouseEvent): void {
        //console.log(this.listRedo.length);
        console.log(this.listRedo.length);
        if (this.listRedo.length > 0) {
            this.isRedoDisabled = false;
            // console.log('redo actif but');
        }
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
        console.log(action);
        if (action) {
            this.listRedo.push(action); // save into redo to be able to cancel the undo.
            // allows to return to the previous "live" state on the canvas
            const tempColor = this.drawingService.baseCtx.strokeStyle;
            const tempAlpha = this.colorService.primaryColorTransparency;
            const tempThickness = this.drawingService.baseCtx.lineWidth;
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            // reapply the currents elements (without the removed one)
            console.log('before the for');
            // BUG: rentre jamais dans le for avec eraserelement
            for (let element of this.listUndo) {
                console.log('element');
                element.apply();
            }
            // allows to return to the previous "live" state on the canvas
            this.drawingService.baseCtx.strokeStyle = tempColor;
            this.colorService.changeColorOpacity(tempAlpha);
            this.drawingService.baseCtx.lineWidth = tempThickness;
            console.log('thai express');
        }
    }
}
