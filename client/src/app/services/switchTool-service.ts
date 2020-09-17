import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { BrushService } from '@app/services/tools/brush.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
@Injectable({
    providedIn: 'root',
})
export class SwitchToolService {
    currentTool: Tool;
    TableTool: Tool[];

    constructor(protected pencilService: PencilService, eraserService: EraserService, brushServie: BrushService) {
        this.TableTool = [pencilService, eraserService, brushServie]; // put all the services of tools here.
    }

    public switchTool(num: number): void {
        this.currentTool = this.TableTool[num];
    }
}
export enum ServiceTool {
    pencilService = 1,
    eraserService = 2,
    brushServie = 3,
}
