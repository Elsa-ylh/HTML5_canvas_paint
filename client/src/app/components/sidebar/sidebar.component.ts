import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolUsed } from '@app/classes/tool';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DrawingInformationsService } from '@app/services/drawing-info/drawing-informations.service';
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
    lineWidth: number;

    constructor(
        public drawingService: DrawingService,
        private dialogNewDrawing: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        public toolService: ToolService,
        public drawingInfos: DrawingInformationsService,
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

    pickRectangle(subTool: number): void {
        this.toolService.switchTool(ToolUsed.Rectangle);
        this.toolService.currentTool.subToolSelect = subTool;
    }

    pickEllipse(): void {
        this.toolService.switchTool(ToolUsed.Ellipse);
        this.toolService.currentTool.subToolSelect = 1;
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

    @HostListener('window:keydown.1', ['$event']) onKeyDown1(event: KeyboardEvent): void {
        this.pickRectangle(1);
    }

    @HostListener('window:keydown.e', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        this.toolService.switchTool(ToolUsed.Eraser);
    }

    // @HostListener('window:keydown.shift', ['$event'])
    // onShiftKeyDown(event: KeyboardEvent): void {
    //     this.drawingService.shiftPressed = true;
    //     console.log("test");
    // }

    // @HostListener('window:keyup.shift', ['$event'])
    // onShiftKeyUp(event: KeyboardEvent): void {
    //   this.drawingService.shiftPressed = false;
    //   console.log("shiftup");
    // }
}
