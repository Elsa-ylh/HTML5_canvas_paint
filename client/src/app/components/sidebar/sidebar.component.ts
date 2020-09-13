import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewDrawingComponent } from '@app/components/dialog-new-drawing/dialog-new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(private drawingService: DrawingService, private dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(DialogNewDrawingComponent);
    }

    clearCanvas(): void {
        if (!this.drawingService.isCanvasBlank()) {
            this.openDialog();
        }
    }

    // keybind control o for new drawing
    @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
        e.preventDefault();
        if ((e.key === 'o' || e.key === 'O') && e.ctrlKey) {
            this.clearCanvas();
        }
    }
}
