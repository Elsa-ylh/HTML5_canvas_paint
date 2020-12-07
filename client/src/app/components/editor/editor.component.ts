import { Component } from '@angular/core';
import { ToolUsed } from '@app/classes/tool';
import { ToolService } from '@app/services/tool-service';
<<<<<<< HEAD
=======

>>>>>>> 03ea3db4d702601470daee97f0b1ebe4171db172
// import { ToolService } from '@app/services/tool-service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(private toolService: ToolService) {}
<<<<<<< HEAD
=======

>>>>>>> 03ea3db4d702601470daee97f0b1ebe4171db172
    /* onMouseUp(event: MouseEvent): void {
        this.toolService.currentTool.onMouseUp(event);
    } */

    onMouseDown(event: MouseEvent): void {
        if (this.toolService.currentToolName === ToolUsed.NONE) {
            this.toolService.currentTool.onDoubleClick(event);
        }
        // this.undoRedoService.whileDrawingUndoRedo(event);
    }
}
