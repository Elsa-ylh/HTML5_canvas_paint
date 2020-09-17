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
        this.TableTool = [pencilService, eraserService]; // put all the services of tools here.
    }

    public switchTool(num: number): void {
        this.currentTool = this.TableTool[num];
    }
}
