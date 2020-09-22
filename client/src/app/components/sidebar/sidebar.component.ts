import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSliderChange } from '@angular/material/slider';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolUsed } from '@app/classes/tool';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';

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
        public toolService: ToolService,
    ) {
        this.showAttributes = true;
        this.toolService.switchTool(ToolUsed.NONE);
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
        this.toolService.switchTool(ToolUsed.Pencil);
    }

    pickEraser(): void {
        this.toolService.switchTool(ToolUsed.Eraser);
    }

    pickBrush(): void {
        this.toolService.switchTool(ToolUsed.Brush);
    }

    pickLine(): void {
        this.toolService.switchTool(ToolUsed.Line);
    }

    pickRectangle(): void {
        this.toolService.switchTool(ToolUsed.Rectangle);
    }

    pickEllipse(): void {
        this.toolService.switchTool(ToolUsed.Ellipse);
    }

    pickColor(): void {
        this.toolService.switchTool(ToolUsed.Color);
    }

    // keybind control o for new drawing
    @HostListener('window:keydown.control.o', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (!this.isDialogOpen && !this.drawingService.isCanvasBlank()) {
            event.preventDefault();
            this.clearCanvas();
            this.isDialogOpen = true;
        }
    }
    shadowBrushTool(): void {}

    thickBrush(): void {
        this.cleanEffectTool();
        this.toolService.switchTool(ToolUsed.thickBrush);
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
    @HostListener('window:keydown.e', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        this.toolService.switchTool(ToolUsed.Eraser);
    }
}
