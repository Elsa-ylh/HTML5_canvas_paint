import { Component } from '@angular/core';
import { ToolUsed } from '@app/classes/tool';
import { ToolService } from '@app/services/tool-service';
// import { ToolService } from '@app/services/tool-service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(private toolService: ToolService) {}
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
