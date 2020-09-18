import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolUsed } from '@app/classes/tool';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    showAttributes: boolean;
    whichTools: ToolUsed;
    isDialogOpen: boolean = false;
    dialogRef: MatDialogRef<DialogCreateNewDrawingComponent>;

    constructor(
        private drawingService: DrawingService,
        private dialogNewDrawing: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        this.showAttributes = true;
        this.whichTools = ToolUsed.NONE;
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
        this.whichTools = ToolUsed.Pencil;
    }

    pickEraser(): void {
        this.whichTools = ToolUsed.Eraser;
    }

    pickBrush(): void {
        this.whichTools = ToolUsed.Brush;
    }

    pickLine(): void {
        this.whichTools = ToolUsed.Line;
    }

    pickRectangle(): void {
        this.whichTools = ToolUsed.Rectangle;
    }

    pickEllipse(): void {
        this.whichTools = ToolUsed.Ellipse;
    }

    pickColor(): void {
        this.whichTools = ToolUsed.Color;
    }

    // keybind control o for new drawing
    @HostListener('window:keydown.control.o', ['$event']) onKeyDown(event: KeyboardEvent): void {
        console.log(this.isDialogOpen);
        debugger;
        if (!this.isDialogOpen && !this.drawingService.isCanvasBlank()) {
            event.preventDefault();
            this.clearCanvas();
            this.isDialogOpen = true;
        }
    }
}
