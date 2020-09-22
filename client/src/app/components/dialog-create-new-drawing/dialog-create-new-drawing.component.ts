import { Component, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-dialog-create-new-drawing',
    templateUrl: './dialog-create-new-drawing.component.html',
    styleUrls: ['./dialog-create-new-drawing.component.scss'],
})
export class DialogCreateNewDrawingComponent {
    message: string = 'Êtes-vous sûr de vouloir effacer votre dessin actuel ?';

    formBuilder: FormBuilder;
    widthControl: FormControl;
    heightControl: FormControl;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: Data,
        private dialogRef: MatDialogRef<DialogCreateNewDrawingComponent>,
        private drawingService: DrawingService,
        private router: Router,
        private fb: FormBuilder,
        public canvasResizerService: CanvasResizerService,
    ) {
        if (this.data) {
            this.message = data.message;
        }
        this.widthControl = this.fb.control(this.canvasResizerService.MIN_CANVAS_SIZE, [
            Validators.min(this.canvasResizerService.MIN_CANVAS_SIZE),
            Validators.max(this.canvasResizerService.MAX_WIDTH_SIZE),
        ]);
        this.heightControl = this.fb.control(this.canvasResizerService.MIN_CANVAS_SIZE, [
            Validators.min(this.canvasResizerService.MIN_CANVAS_SIZE),
            Validators.max(this.canvasResizerService.MAX_HEIGHT_SIZE),
        ]);
    }

    @HostListener('window:keydown.enter', ['$event']) onEnter(event: KeyboardEvent): void {
        this.onConfirmClick();
    }

    onConfirmClick(): void {
        if (
            this.widthControl.value >= this.canvasResizerService.MIN_CANVAS_SIZE &&
            this.widthControl.value <= this.canvasResizerService.MAX_WIDTH_SIZE &&
            this.heightControl.value >= this.canvasResizerService.MIN_CANVAS_SIZE &&
            this.heightControl.value <= this.canvasResizerService.MAX_HEIGHT_SIZE
        ) {
            this.canvasResizerService.canvasSize.x = this.widthControl.value;
            this.canvasResizerService.canvasSize.y = this.heightControl.value;
            this.dialogRef.close(true);
            if (!this.data) {
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            }
            this.router.navigate(['/editor']);
        }
    }
}
