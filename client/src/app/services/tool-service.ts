import { Injectable } from '@angular/core';
import { Tool, ToolUsed } from '@app/classes/tool';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { BrushService } from './tools/brush.service';
import { LineService } from './tools/line.service';
@Injectable({
    providedIn: 'root',
})
export class ToolService {
    currentToolName: ToolUsed;
    currentTool: Tool;
    private tableTool: Tool[] = new Array();

    constructor(
        private pencilService: PencilService,
        private eraserService: EraserService,
        private brushService: BrushService,
        private lineService: LineService,
        private rectangleService: RectangleService,
    ) {
        this.tableTool[ToolUsed.NONE] = this.pencilService;
        this.tableTool[ToolUsed.Pencil] = this.pencilService;
        this.tableTool[ToolUsed.Eraser] = this.eraserService;
        this.tableTool[ToolUsed.Brush] = this.brushService;
        this.tableTool[ToolUsed.Line] = this.lineService;
        this.tableTool[ToolUsed.Rectangle] = this.rectangleService;

        this.switchTool(ToolUsed.Pencil); // default tools
    }

    switchTool(toolUsed: ToolUsed): void {
        this.currentTool = this.tableTool[toolUsed];
        this.currentToolName = toolUsed;
    }
}
