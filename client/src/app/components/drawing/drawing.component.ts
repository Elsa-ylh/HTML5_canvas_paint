import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';

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

    constructor(private drawingService: DrawingService, private toolService: ToolService, private canvasResizerService: CanvasResizerService) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolService.currentTool.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.toolService.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolService.currentTool.onMouseUp(event);
    }

    @HostListener('window:keydown.shift', ['$event'])
    onKeyShiftDown(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyDown(event);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onKeyShiftUp(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyUp(event);
    }

    get width(): number {
        return this.canvasResizerService.canvasSize.x;
    }

    get height(): number {
        return this.canvasResizerService.canvasSize.y;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.canvasResizerService.onResize(event);
    }
}
