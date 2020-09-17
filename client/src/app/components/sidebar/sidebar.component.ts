import { Component } from '@angular/core';
import { SwitchToolService } from '@app/services/switchTool-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(private switchToolServ: SwitchToolService) {}

    SetPencil = () => this.switchToolServ.switchTool(0);
    SetEraser = () => this.switchToolServ.switchTool(1);
}
