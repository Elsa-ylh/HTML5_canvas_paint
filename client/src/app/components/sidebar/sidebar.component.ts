import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSliderChange } from '@angular/material/slider';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolUsed } from '@app/classes/tool';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    showAttributes: boolean;
    isDialogOpen: boolean = false;
    dialogRef: MatDialogRef<DialogCreateNewDrawingComponent>;
    pxSize: number;
    constructor(
        public drawingService: DrawingService,
        private dialogNewDrawing: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        this.showAttributes = true;
        drawingService.whichTools = ToolUsed.NONE;
    }

    ngOnInit(): void {
        this.iconRegistry.addSvgIcon('eraser', this.sanitizer.bypassSecurityTrustResourceUrl('assets/clarity_eraser-solid.svg'));
    }

    clearCanvas(): void {
        if (!this.drawingService.isCanvasBlank()) {
            this.dialogRef = this.dialogNewDrawing.open(DialogCreateNewDrawingComponent);
            this.dialogRef.afterClosed().subscribe(() => {
                this.isDialogOpen = false;
            });
        }
    }

    createNewDrawing(): void {
        this.dialogNewDrawing.open(DialogCreateNewDrawingComponent);
    }

    pickPencil(): void {
        this.drawingService.currentTool = new PencilService(this.drawingService);
        this.drawingService.whichTools = ToolUsed.Pencil;
    }

    pickEraser(): void {
        this.drawingService.whichTools = ToolUsed.Eraser;
    }

    pickLine(): void {
        this.drawingService.whichTools = ToolUsed.Line;
        this.drawingService.baseCtx.lineWidth = this.pxSize;
        this.drawingService.previewCtx.lineWidth = this.pxSize;
    }

    pickRectangle(): void {
        this.drawingService.currentTool = new RectangleService(this.drawingService);
        this.drawingService.whichTools = ToolUsed.Rectangle;
    }

    pickEllipse(): void {
        this.drawingService.whichTools = ToolUsed.Ellipse;
    }

    pickColor(): void {
        this.drawingService.whichTools = ToolUsed.Color;
    }

    // keybind control o for new drawing
    @HostListener('window:keydown.control.o', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (!this.isDialogOpen && !this.drawingService.isCanvasBlank()) {
            event.preventDefault();
            this.clearCanvas();
            this.isDialogOpen = true;
        }
    }
    // racoussi pour pinceau marche pas
    @HostListener('window:keydown.control.w', ['$event']) onKeyBrush(event: KeyboardEvent): void {
        this.pickBrush();
    }
    pickBrush(): void {
        this.cleanEffectTool();
        this.drawingService.whichTools = ToolUsed.Brush;
        this.pxSize = this.drawingService.baseCtx.lineWidth;
    }

    shadowBrushTool(): void {
        this.cleanEffectTool();
        this.pickBrush();
        this.drawingService.baseCtx.shadowColor = 'rgb(0, 0, 0)';
        this.drawingService.baseCtx.shadowBlur = this.pxSize + 2;
    }

    thickBrush(): void {
        this.drawingService.whichTools = ToolUsed.thickBrush;
    }

    sliderSliding(args: MatSliderChange): void {
        console.log(args.value);
        if (args.value) {
            this.drawingService.baseCtx.lineWidth = args.value;
            this.drawingService.previewCtx.lineWidth = args.value;
        }
    }

    private cleanEffectTool() {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.lineWidth = this.pxSize;
        this.drawingService.previewCtx.lineWidth = this.pxSize;
        this.drawingService.baseCtx.strokeStyle = '#000000'; // to draw after erasing
        this.drawingService.previewCtx.strokeStyle = '#000000';
    }
}
