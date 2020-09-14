import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-dialog-new-drawing',
    templateUrl: './dialog-new-drawing.component.html',
})
export class DialogNewDrawingComponent {
    constructor(private dialogRef: MatDialogRef<DialogNewDrawingComponent>, private drawingService: DrawingService) {}

    @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
        e.preventDefault();
        if (e.key === 'Enter') {
            this.onConfirmClick();
        }
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
