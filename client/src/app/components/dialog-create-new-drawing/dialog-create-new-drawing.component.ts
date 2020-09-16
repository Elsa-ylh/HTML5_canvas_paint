import { Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-dialog-create-new-drawing',
    templateUrl: './dialog-create-new-drawing.component.html',
    styleUrls: ['./dialog-create-new-drawing.component.scss'],
})
export class DialogCreateNewDrawingComponent {
    xAxis: number;
    yAxis: number;
    message: string = 'Etes vous sur de vouloir effacer votre dessin actuel ?';

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: Data,
        public dialogRef: MatDialogRef<DialogCreateNewDrawingComponent>,
        private drawingService: DrawingService,
    ) {
        if (this.data) {
            this.message = data.message;
        }
    }

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
