import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DialogNewDrawingComponent } from '@app/components/dialog-new-drawing/dialog-new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(
        private drawingService: DrawingService,
        private dialogClear: MatDialog,
        private dialogNewDrawing: MatDialog,
        public iconRegistry: MatIconRegistry,
        public sanitizer: DomSanitizer,
    ) {
        iconRegistry.addSvgIcon('eraser', sanitizer.bypassSecurityTrustResourceUrl('assets/clarity_eraser-solid.svg'));
    }

    clearCanvas(): void {
        if (!this.drawingService.isCanvasBlank()) {
            this.dialogClear.open(DialogNewDrawingComponent);
        }
    }

    createNewDrawing(): void {
        this.dialogNewDrawing.open(DialogCreateNewDrawingComponent);
    }

    // keybind control o for new drawing
    @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
        e.preventDefault();
        if (e.ctrlKey && e.code === 'KeyO') {
            this.clearCanvas();
        }
    }
}
