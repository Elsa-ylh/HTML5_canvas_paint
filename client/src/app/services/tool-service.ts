import { Injectable } from '@angular/core';
import { Tool, ToolUsed } from '@app/classes/tool';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolService {
    currentToolName: ToolUsed;
    currentTool: Tool;
    private tableTool: Tool[] = new Array();

    constructor(protected pencilService: PencilService, protected eraserService: EraserService, protected rectangleService: RectangleService) {
        this.tableTool[ToolUsed.NONE] = pencilService;
        this.tableTool[ToolUsed.Pencil] = pencilService;
        this.tableTool[ToolUsed.Eraser] = eraserService;
        // this.tableTool[ToolUsed.Brush] = brushService;
        // this.tableTool[ToolUsed.Line] = lineService;
        this.tableTool[ToolUsed.Rectangle] = rectangleService;
    }

    switchTool(toolUsed: ToolUsed): void {
        this.currentTool = this.tableTool[toolUsed];
        this.currentToolName = toolUsed;
    }
}
