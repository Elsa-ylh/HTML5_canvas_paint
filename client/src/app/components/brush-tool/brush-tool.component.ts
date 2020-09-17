import { Component, ElementRef, ViewChild } from '@angular/core';
import { ServiceTool, SwitchToolService } from '@app/services/switchTool-service';

@Component({
    selector: 'app-brush-tool',
    templateUrl: './brush-tool.component.html',
    styleUrls: ['./brush-tool.component.scss'],
})
export class BrushToolComponent {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    /* private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: 250, y: 250 }; // je ne suis pas sur que sa doit être la ca sa affete tous le dessin peut inporte le component
*/
    constructor(private switchToolServ: SwitchToolService) {
        this.naturalBrushTool();
    }
    // Parmet d'avoir un pinceau
    naturalBrushTool() {
        this.switchToolServ.switchTool(ServiceTool.brushServie);
    }
}
