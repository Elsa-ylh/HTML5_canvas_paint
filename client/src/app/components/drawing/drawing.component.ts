import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { cursorName } from '@app/classes/cursor-name';
import {
    RESIZE_CORNER_PROPORTION,
    RESIZE_HOOK_THICKNESS,
    RESIZE_MIDDLE_LOWER_PROPORTION,
    RESIZE_MIDDLE_UPPER_PROPORTION,
} from '@app/classes/resize-canvas';
import { ResizeDirection } from '@app/classes/resize-direction';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    constructor(
        private drawingService: DrawingService,
        private toolService: ToolService,
        public crs: CanvasResizerService,
        private undoRedo: UndoRedoService,
    ) {}

    get width(): number {
        return this.crs.canvasSize.x;
    }

    get height(): number {
        return this.crs.canvasSize.y;
    }

    get cursorUsed(): string {
        return this.drawingService.cursorUsed;
    }

    // On utilise ce canvas pour dessiner sans affecter le dessin final, aussi utilisé pour sauvegarder
    // une version du dessin avant de l'appliquer au final.
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasResizingPreview', { static: false }) canvasResizingPreview: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private resizeCtx: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.resizeCtx = this.canvasResizingPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    onMouseDown(event: MouseEvent): void {
        this.toolService.currentTool.onMouseDown(event);
        this.undoRedo.onMouseDownActivate(event); // activate or not undo redo
    }

    onMouseMove(event: MouseEvent): void {
        this.toolService.currentTool.onMouseMove(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.toolService.currentTool.onMouseUp(event);
        this.undoRedo.onMouseUpActivate(event);
    }

    onMouseOut(event: MouseEvent): void {
        this.toolService.currentTool.onMouseOut(event);
    }
    onMouseEnter(event: MouseEvent): void {
        this.toolService.currentTool.onMouseEnter(event);
    }

    onResizeDown(event: MouseEvent): void {
        const isVertical =
            this.crs.canvasSize.y < event.offsetY &&
            event.offsetY < this.crs.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.crs.canvasSize.x * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetX &&
            event.offsetX < this.crs.canvasSize.x * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isHorizontal =
            this.crs.canvasSize.x < event.offsetX &&
            event.offsetX < this.crs.canvasSize.x + RESIZE_HOOK_THICKNESS &&
            this.crs.canvasSize.y * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetY &&
            event.offsetY < this.crs.canvasSize.y * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isVerticalAndHorizontal =
            this.crs.canvasSize.y * RESIZE_CORNER_PROPORTION < event.offsetY &&
            event.offsetY < this.crs.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.crs.canvasSize.x * RESIZE_CORNER_PROPORTION < event.offsetX &&
            event.offsetX < this.crs.canvasSize.x + RESIZE_HOOK_THICKNESS;

        if (isVerticalAndHorizontal) {
            this.crs.resizeCursor = cursorName.resizeVerticalAndHorizontal;
            this.crs.onResizeDown(event, ResizeDirection.verticalAndHorizontal);
        } else if (isVertical) {
            this.crs.resizeCursor = cursorName.resizeVertical;
            this.crs.onResizeDown(event, ResizeDirection.vertical);
        } else if (isHorizontal) {
            this.crs.resizeCursor = cursorName.resizeHorizontal;
            this.crs.onResizeDown(event, ResizeDirection.horizontal);
        }
    }

    onResizeMove(event: MouseEvent): void {
        if (this.crs.isResizeDown) {
            this.crs.onResize(event, this.resizeCtx);
        } else {
            const isVertical =
                this.crs.canvasSize.y < event.offsetY &&
                event.offsetY < this.crs.canvasSize.y + RESIZE_HOOK_THICKNESS &&
                this.crs.canvasSize.x * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetX &&
                event.offsetX < this.crs.canvasSize.x * RESIZE_MIDDLE_UPPER_PROPORTION;
            const isHorizontal =
                this.crs.canvasSize.x < event.offsetX &&
                event.offsetX < this.crs.canvasSize.x + RESIZE_HOOK_THICKNESS &&
                this.crs.canvasSize.y * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetY &&
                event.offsetY < this.crs.canvasSize.y * RESIZE_MIDDLE_UPPER_PROPORTION;
            const isVerticalAndHorizontal =
                this.crs.canvasSize.y * RESIZE_CORNER_PROPORTION < event.offsetY &&
                event.offsetY < this.crs.canvasSize.y + RESIZE_HOOK_THICKNESS &&
                this.crs.canvasSize.x * RESIZE_CORNER_PROPORTION < event.offsetX &&
                event.offsetX < this.crs.canvasSize.x + RESIZE_HOOK_THICKNESS;

            if (isVerticalAndHorizontal) {
                this.crs.resizeCursor = cursorName.resizeVerticalAndHorizontal;
            } else if (isVertical) {
                this.crs.resizeCursor = cursorName.resizeVertical;
            } else if (isHorizontal) {
                this.crs.resizeCursor = cursorName.resizeHorizontal;
            } else {
                this.crs.resizeCursor = cursorName.default;
            }
        }
    }

    onResizeUp(event: MouseEvent): void {
        this.crs.onResizeUp(event, this.resizeCtx, this.baseCanvas.nativeElement);
    }

    onResizeOut(event: MouseEvent): void {
        this.crs.onResizeOut(event, this.resizeCtx, this.baseCanvas.nativeElement);
    }

    @HostListener('window:keydown.shift', ['$event'])
    onKeyShiftDown(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyDown(event);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onKeyShiftUp(event: KeyboardEvent): void {
        this.toolService.currentTool.OnShiftKeyUp(event);
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        this.toolService.currentTool.onDoubleClick(event);
    }

    @HostListener('window:keydown.escape', ['$event'])
    onKeyEscape(event: KeyboardEvent): void {
        this.toolService.currentTool.onKeyEscape(event);
    }

    @HostListener('window:keydown.backspace', ['$event'])
    onKeyBackSpace(event: KeyboardEvent): void {
        this.toolService.currentTool.onKeyBackSpace(event);
    }
}
