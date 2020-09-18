import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, minSizeCanvas, minSizeWindow, sizeSidebar } from '@app/classes/info-Window';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServiceTool, SwitchToolService } from '@app/services/switchTool-service';
// TODO : Avoir un fichier séparé pour les constantes ?

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    // private tools: Tool[];
    //currentTool: Tool;
    constructor(private drawingService: DrawingService, private switchToolServ: SwitchToolService) {
        switchToolServ.switchTool(ServiceTool.pencilService);
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        console.log('ngafterview');
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

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
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
