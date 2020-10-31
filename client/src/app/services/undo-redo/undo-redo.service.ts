import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    isundoDisabled: boolean = true; // to disactivate the option to redo-redo. diabled=true (cant undo-red0 when app loads)
    isRedoDisabled: boolean = true;
    defaultCanvasAction: ResizeCanvasAction; // will be instanciated when canvas is ngAfterViewInit
    nbinRedoList: number = 0;
    nbinUndoList: number = 0;
    nbinResizeList: number = 0;
    private listUndo: AbsUndoRedo[] = [];
    private listRedo: AbsUndoRedo[] = [];

    constructor(private drawingService: DrawingService) {}

    // Controls the buttons of redo-undo
    onMouseUpActivateUndo(mouseEvent: MouseEvent): void {
        console.log('undo', this.nbinUndoList);
        if (this.listUndo.length > 0 || this.nbinResizeList > 0) {
            this.isundoDisabled = false;
        }
    }
    onMouseUpActivateRedo(mouseEvent: MouseEvent): void {
        console.log('redo', this.nbinRedoList);
        if (this.nbinRedoList > 0 || this.nbinResizeList > 0) {
            this.isRedoDisabled = false;
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
            this.nbinRedoList--;
            if (action) {
                this.listUndo.push(action);
                this.nbinUndoList++;
                action.apply(); // applies the action
            }
        }
    }

    // allows to reset the listUndo after we redo something.
    clearUndo(): void {
        this.listUndo = [];
        this.nbinUndoList = 0;
    }
    // allows to reset the listRedo
    clearRedo(): void {
        this.listRedo = [];
        this.nbinRedoList = 0;
    }

    // adds the latest  action to the undo stack.
    addUndo(action: AbsUndoRedo): void {
        this.listUndo.push(action);
        this.nbinUndoList++;
    }
    // function that cancels the lastest modification.(ctrl z) we push the lastest element removed from the undo stack.
    undo(): void {
        const action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack
        this.nbinUndoList--;
        if (action) {
            this.listRedo.push(action);
            this.nbinRedoList++;
            const listOfResize: AbsUndoRedo[] = [];

            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            // reapply the currents elements (without the removed one)
            for (const element of this.listUndo) {
                if (element instanceof ResizeCanvasAction) {
                    listOfResize.push(element);
                    this.nbinResizeList++;
                } else {
                    element.apply();
                }
            }

            if (listOfResize.length === 0) {
                this.defaultCanvasAction.apply();
            } else {
                listOfResize[listOfResize.length - 1].apply();
            }
        }
    }
}
