import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolUsed } from '@app/classes/tool';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { RectangleService } from '@app/services/tools/rectangle.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    showAttributes: boolean;
    isDialogOpen: boolean = false;
    newDrawingRef: MatDialogRef<DialogCreateNewDrawingComponent>;
    checkDocumentationRef: MatDialogRef<WriteTextDialogUserGuideComponent>;

    constructor(
        public drawingService: DrawingService,
        private dialogCreator: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        public toolService: ToolService,
        public rectangleService: RectangleService,
        public ellipseService: EllipseService,
    ) {
        this.showAttributes = true;
        this.toolService.switchTool(ToolUsed.NONE);
        this.iconRegistry.addSvgIcon('eraser', this.sanitizer.bypassSecurityTrustResourceUrl('assets/clarity_eraser-solid.svg'));
    }

    clearCanvas(): void {
        if (!this.drawingService.isCanvasBlank()) {
            this.newDrawingRef = this.dialogCreator.open(DialogCreateNewDrawingComponent);
            this.newDrawingRef.afterClosed().subscribe(() => {
                this.isDialogOpen = false;
            });
        }
    }

    createNewDrawing(): void {
        this.dialogCreator.open(DialogCreateNewDrawingComponent);
    }

    openUserGuide(): void {
        this.checkDocumentationRef = this.dialogCreator.open(WriteTextDialogUserGuideComponent, {
            width: '90%',
            height: '100%',
        });
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

    pickEllipse(subTool2: number): void {
        this.toolService.switchTool(ToolUsed.Ellipse);
        this.toolService.currentTool.subToolSelect = subTool2;
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

    @HostListener('window:keydown.2', ['$event']) onKeyDown2(event: KeyboardEvent): void {
        this.pickEllipse(1);
    }

    @HostListener('window:keydown.e', ['$event'])
    changeEraserMode(event: KeyboardEvent): void {
        this.toolService.switchTool(ToolUsed.Eraser);
    }

    @HostListener('window:keydown.c', ['$event'])
    changePencilMode(event: KeyboardEvent): void {
        this.toolService.switchTool(ToolUsed.Pencil);
    }
}
