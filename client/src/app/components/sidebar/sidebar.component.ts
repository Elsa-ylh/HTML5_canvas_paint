import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DialogNewDrawingComponent } from '@app/components/dialog-new-drawing/dialog-new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(private drawingService: DrawingService, private dialogClear: MatDialog, private dialogNewDrawing: MatDialog) {}

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
        if ((e.key === 'o' || e.key === 'O') && e.ctrlKey) {
            this.clearCanvas();
        }
    }
}
