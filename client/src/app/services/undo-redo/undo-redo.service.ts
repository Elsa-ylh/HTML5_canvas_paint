import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { LoadAction } from '@app/classes/undo-redo/load-action';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    isUndoDisabled: boolean = true; // to disactivate the option to redo-redo. diabled=true (cant undo-red0 when app loads)
    isRedoDisabled: boolean = true;
    defaultCanvasAction: ResizeCanvasAction; // will be instanciated when canvas is ngAfterViewInit
    private firstLoadedImage: LoadAction;
    private listUndo: AbsUndoRedo[] = [];
    private listRedo: AbsUndoRedo[] = [];

    constructor(private drawingService: DrawingService) {}
    // private canvasResizeService: CanvasResizerService
    redo(): void {
        if (this.listRedo.length > 0) {
            const action = this.listRedo.pop();
            if (action) {
                this.listUndo.push(action);
                action.apply(); // applies the action
            }
        }
        this.updateStatus();
    }

    // allows to reset the listUndo after we redo something.
    clearUndo(): void {
        this.listUndo = [];
        this.updateStatus();
    }
    // allows to reset the listRedo
    clearRedo(): void {
        this.listRedo = [];
        this.updateStatus();
    }

    // adds the latest  action to the undo stack.
    addUndo(action: AbsUndoRedo): void {
        this.listUndo.push(action);
        this.updateStatus();
    }

    // to load an image from the caroussel
    loadImage(action: LoadAction): void {
        this.firstLoadedImage = action;
    }

    // function that cancels the lastest modification.(ctrl z) we push the lastest element removed from the undo stack.
    async undo() {
        const action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack
        if (action) {
            this.listRedo.push(action);
            const listOfResize: AbsUndoRedo[] = [];

            //this.drawingService.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.firstLoadedImage) {
                await this.firstLoadedImage.apply();
                listOfResize.push(this.firstLoadedImage);
            } else {
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
            }
            // reapply the currents elements (without the removed one)
            for (const element of this.listUndo) {
                if (element instanceof ResizeCanvasAction) {
                    listOfResize.push(element);
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
        this.updateStatus();
    }

    // Controls the buttons of redo-undo
    updateStatus(): void {
        this.isRedoDisabled = this.listRedo.length === 0;
        this.isUndoDisabled = this.listUndo.length === 0;
    }

    // deactivate the buttons when drawing on the canvas
    whileDrawingUndoRedo(event: MouseEvent): void {
        this.isUndoDisabled = true;
        this.isRedoDisabled = true;
    }

    activateUndo(event: MouseEvent): void {
        this.isUndoDisabled = false;
    }
}
