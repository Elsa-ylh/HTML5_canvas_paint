import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ServiceTool, SwitchToolService } from '@app/services/switchTool-service';

export const DEFAULT_WIDTH = window.innerWidth / 2;
export const DEFAULT_HEIGHT = window.innerHeight / 2;
const sizeSidebar = 200;
const minSizeWindow = 500;
const minSizeCanvas = 250;
@Component({
    selector: 'app-brush-tool',
    templateUrl: './brush-tool.component.html',
    styleUrls: ['./brush-tool.component.scss'],
})
export class BrushToolComponent {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT }; // je ne suis pas sur que sa doit être la ca sa affete tous le dessin peut inporte le component

    constructor(private switchToolServ: SwitchToolService) {
        this.naturalBrushTool();
    }
    // Parmet d'avoir un pinceau
    naturalBrushTool() {
        this.switchToolServ.switchTool(ServiceTool.brushServie);
    }
    sizeSmall() {
        this.baseCtx.lineWidth = 4;
        this.previewCtx.lineWidth = 4;
    }
    sizeMedium(): void {
        this.baseCtx.lineWidth = 8;
        this.previewCtx.lineWidth = 8;
    }
    sizeBig(): void {
        this.baseCtx.lineWidth = 12;
        this.previewCtx.lineWidth = 12;
    }
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.switchToolServ.currentTool.onMouseMove(event);
        console.log('mousemove');
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.switchToolServ.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.switchToolServ.currentTool.onMouseUp(event);
    }
    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        if (window.innerWidth <= minSizeWindow && window.innerHeight <= minSizeWindow) {
            this.canvasSize.x = minSizeCanvas;
            this.canvasSize.y = minSizeCanvas;
        } else {
            // Might be made responsive
            this.canvasSize.x = DEFAULT_WIDTH - sizeSidebar;
            this.canvasSize.y = DEFAULT_HEIGHT;
        }
    }
}
