import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(private drawing: DrawingService) {

    }

    changePencil() {
        this.drawing.baseCtx.strokeStyle = "#000000";
        this.drawing.previewCtx.strokeStyle = "#000000";
    }
    changeEraser() {
        this.drawing.baseCtx.strokeStyle = "#FFF";
        this.drawing.previewCtx.strokeStyle = "#FFF";
        this.drawing.baseCtx.lineWidth = 5;
        this.drawing.previewCtx.lineWidth = 5;
    }
}
