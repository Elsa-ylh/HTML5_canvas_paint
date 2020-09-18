import { Injectable } from '@angular/core';
import { Tool, ToolUsed } from '@app/classes/tool';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolService {
    currentToolName: ToolUsed;
    currentTool: Tool;
    private tableTool: Array<Tool> = new Array<Tool>();

    constructor(protected pencilService: PencilService, protected eraserService: EraserService) {
        this.tableTool[ToolUsed.NONE] = pencilService;
        this.tableTool[ToolUsed.Pencil] = pencilService;
        this.tableTool[ToolUsed.Eraser] = eraserService;
        // this.TableTool[ToolUsed.Brush] =
        // this.TableTool[ToolUsed.Line] =
        // this.TableTool[ToolUsed.Rectangle] =
        // this.TableTool[ToolUsed.Ellipse] =
        // this.TableTool[ToolUsed.Color] =
    }

    switchTool(toolUsed: ToolUsed): void {
        this.currentTool = this.tableTool[toolUsed];
        this.currentToolName = toolUsed;
    }
}
