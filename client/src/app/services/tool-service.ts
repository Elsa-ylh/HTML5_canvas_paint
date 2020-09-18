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
    private TableTool: Array<Tool> = new Array<Tool>();

    constructor(protected pencilService: PencilService, protected eraserService: EraserService) {
        this.TableTool[ToolUsed.NONE] = pencilService;
        this.TableTool[ToolUsed.Pencil] = pencilService;
        this.TableTool[ToolUsed.Eraser] = eraserService;
        //this.TableTool[ToolUsed.Brush] =
        //this.TableTool[ToolUsed.Line] =
        //this.TableTool[ToolUsed.Rectangle] =
        //this.TableTool[ToolUsed.Ellipse] =
        //this.TableTool[ToolUsed.Color] =
    }

    public switchTool(toolUsed: ToolUsed): void {
        this.currentTool = this.TableTool[toolUsed];
        this.currentToolName = toolUsed;
    }
}
