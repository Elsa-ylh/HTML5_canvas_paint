import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { cursorName } from '@app/classes/cursor-name';
import {
    RESIZE_CORNER_PROPORTION,
    RESIZE_HOOK_THICKNESS,
    RESIZE_MIDDLE_LOWER_PROPORTION,
    RESIZE_MIDDLE_UPPER_PROPORTION,
} from '@app/classes/resize-canvas';
import { ResizeDirection } from '@app/classes/resize-direction';
import { ToolUsed } from '@app/classes/tool';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
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
        public toolService: ToolService,
        public cvsResizerService: CanvasResizerService,
        public colorService: ColorService,
        public undoRedoService: UndoRedoService,
    ) {}

    get width(): number {
        return this.cvsResizerService.canvasSize.x;
    }

    get height(): number {
        return this.cvsResizerService.canvasSize.y;
    }

    get cursorUsed(): string {
        return this.drawingService.cursorUsed;
    }

    get dropper(): ToolUsed.Dropper {
        return ToolUsed.Dropper;
    }

    get stamp(): ToolUsed.Stamp {
        return ToolUsed.Stamp;
    }

    // On utilise ce canvas pour dessiner sans affecter le dessin final, aussi utilisé pour sauvegarder
    // une version du dessin avant de l'appliquer au final.
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasResizingPreview', { static: false }) canvasResizingPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('dropperLayer', { static: false }) dropperLayer: ElementRef<HTMLCanvasElement>;
    @ViewChild('stampLayer', { static: false }) stampLayer: ElementRef<HTMLCanvasElement>;

    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    private resizeCtx: CanvasRenderingContext2D;

    private dropperCtx: CanvasRenderingContext2D;
    private stampCtx: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.resizeCtx = this.canvasResizingPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.dropperCtx = this.dropperLayer.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.dropperCtx = this.dropperCtx;
        this.stampCtx = this.stampLayer.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.stampCtx = this.stampCtx;
        this.setCanvasBackgroundColor();

        const event = { offsetX: this.cvsResizerService.DEFAULT_WIDTH, offsetY: this.cvsResizerService.DEFAULT_HEIGHT } as MouseEvent;
        this.undoRedoService.defaultCanvasAction = new ResizeCanvasAction(
            event,
            this.resizeCtx,
            this.baseCanvas.nativeElement,
            ResizeDirection.verticalAndHorizontal,
            this.cvsResizerService,
        );
    }

    setCanvasBackgroundColor(): void {
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.baseCanvas.nativeElement.width, this.baseCanvas.nativeElement.height);
    }

    onMouseDown(event: MouseEvent): void {
        this.toolService.currentTool.onMouseDown(event);
        this.undoRedoService.whileDrawingUndoRedo(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.toolService.currentTool.onMouseMove(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.toolService.currentTool.onMouseUp(event);
        this.undoRedoService.activateUndo(event);
    }

    onMouseOut(event: MouseEvent): void {
        this.toolService.currentTool.onMouseOut(event);
    }
    onMouseEnter(event: MouseEvent): void {
        this.toolService.currentTool.onMouseEnter(event);
    }

    onResizeDown(event: MouseEvent): void {
        const isVertical =
            this.cvsResizerService.canvasSize.y < event.offsetY &&
            event.offsetY < this.cvsResizerService.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.cvsResizerService.canvasSize.x * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetX &&
            event.offsetX < this.cvsResizerService.canvasSize.x * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isHorizontal =
            this.cvsResizerService.canvasSize.x < event.offsetX &&
            event.offsetX < this.cvsResizerService.canvasSize.x + RESIZE_HOOK_THICKNESS &&
            this.cvsResizerService.canvasSize.y * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetY &&
            event.offsetY < this.cvsResizerService.canvasSize.y * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isVerticalAndHorizontal =
            this.cvsResizerService.canvasSize.y * RESIZE_CORNER_PROPORTION < event.offsetY &&
            event.offsetY < this.cvsResizerService.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.cvsResizerService.canvasSize.x * RESIZE_CORNER_PROPORTION < event.offsetX &&
            event.offsetX < this.cvsResizerService.canvasSize.x + RESIZE_HOOK_THICKNESS;

        if (isVerticalAndHorizontal) {
            this.cvsResizerService.resizeCursor = cursorName.resizeVerticalAndHorizontal;
            this.cvsResizerService.onResizeDown(event, ResizeDirection.verticalAndHorizontal);
            return;
        }
        if (isVertical) {
            this.cvsResizerService.resizeCursor = cursorName.resizeVertical;
            this.cvsResizerService.onResizeDown(event, ResizeDirection.vertical);
            return;
        }
        if (isHorizontal) {
            this.cvsResizerService.resizeCursor = cursorName.resizeHorizontal;
            this.cvsResizerService.onResizeDown(event, ResizeDirection.horizontal);
            return;
        }
    }

    onResizeMove(event: MouseEvent): void {
        if (this.cvsResizerService.isResizeDown) {
            this.cvsResizerService.onResize(event, this.resizeCtx);
        }

        const isVertical =
            this.cvsResizerService.canvasSize.y < event.offsetY &&
            event.offsetY < this.cvsResizerService.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.cvsResizerService.canvasSize.x * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetX &&
            event.offsetX < this.cvsResizerService.canvasSize.x * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isHorizontal =
            this.cvsResizerService.canvasSize.x < event.offsetX &&
            event.offsetX < this.cvsResizerService.canvasSize.x + RESIZE_HOOK_THICKNESS &&
            this.cvsResizerService.canvasSize.y * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetY &&
            event.offsetY < this.cvsResizerService.canvasSize.y * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isVerticalAndHorizontal =
            this.cvsResizerService.canvasSize.y * RESIZE_CORNER_PROPORTION < event.offsetY &&
            event.offsetY < this.cvsResizerService.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.cvsResizerService.canvasSize.x * RESIZE_CORNER_PROPORTION < event.offsetX &&
            event.offsetX < this.cvsResizerService.canvasSize.x + RESIZE_HOOK_THICKNESS;

        if (isVerticalAndHorizontal) {
            this.cvsResizerService.resizeCursor = cursorName.resizeVerticalAndHorizontal;
            return;
        }
        if (isVertical) {
            this.cvsResizerService.resizeCursor = cursorName.resizeVertical;
            return;
        }
        if (isHorizontal) {
            this.cvsResizerService.resizeCursor = cursorName.resizeHorizontal;
            return;
        }
    }

    onResizeUp(event: MouseEvent): void {
        this.cvsResizerService.onResizeUp(event, this.resizeCtx, this.baseCanvas.nativeElement);
    }

    onResizeOut(event: MouseEvent): void {
        this.cvsResizerService.onResizeOut(event, this.resizeCtx, this.baseCanvas.nativeElement);
    }

    onMouseOverMainCanvas(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.previewColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.baseCtx));
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent): void {
        if (this.toolService.currentToolName === ToolUsed.PaintBucket || this.toolService.currentToolName === ToolUsed.Dropper) {
            event.preventDefault();
        }
    }

    @HostListener('window:keydown.shift', ['$event'])
    onKeyShiftDown(event: KeyboardEvent): void {
        this.toolService.currentTool.onShiftKeyDown(event);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onKeyShiftUp(event: KeyboardEvent): void {
        this.toolService.currentTool.onShiftKeyUp(event);
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
