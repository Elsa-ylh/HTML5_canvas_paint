import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class SwitchToolService {
    currentTool: Tool;
    TableTool: Tool[];

    constructor(protected pencilService: PencilService, eraserService: EraserService) {
        this.TableTool[0] = pencilService;
        this.TableTool[1] = eraserService;
    }

    public switchTool(num: number): void {
        //add tt les services.
        this.currentTool = this.TableTool[num];
    }

    public SwitchToolType(num: number): Tool {
        this.currentTool = this.TableTool[num];
        return this.currentTool;
    }
}
