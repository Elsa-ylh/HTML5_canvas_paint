import { Injectable } from '@angular/core';
import { Tool, ToolUsed } from '@app/classes/tool';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { BrushService } from './tools/brush.service';
import { EllipseService } from './tools/ellipse.service';
import { LineService } from './tools/line.service';
import { PolygonService } from './tools/polygon.service';
import { SelectionService } from './tools/selection-service';
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
        private ellipseService: EllipseService,
        private selectionService: SelectionService,
        private polygonService: PolygonService,
    ) {
        this.tableTool[ToolUsed.NONE] = this.pencilService;
        this.tableTool[ToolUsed.Pencil] = this.pencilService;
        this.tableTool[ToolUsed.Eraser] = this.eraserService;
        this.tableTool[ToolUsed.Brush] = this.brushService;
        this.tableTool[ToolUsed.Line] = this.lineService;
        this.tableTool[ToolUsed.Rectangle] = this.rectangleService;
        this.tableTool[ToolUsed.Ellipse] = this.ellipseService;
        this.tableTool[ToolUsed.Selection] = this.selectionService;
        this.tableTool[ToolUsed.Polygon] = this.polygonService;

        this.switchTool(ToolUsed.NONE); // default tools if all else fail in the sidebar usually
    }

    switchTool(toolUsed: ToolUsed): void {
        // color is special as we don't change tool per say, we are simply making an extension of making other tools
        // change color
        if (toolUsed !== ToolUsed.Color) {
            this.currentTool = this.tableTool[toolUsed];
        }
        this.currentTool.cleanPaintGrout();
        this.currentToolName = toolUsed;
    }
}
