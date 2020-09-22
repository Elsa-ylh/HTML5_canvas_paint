import { Component, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-dialog-create-new-drawing',
    templateUrl: './dialog-create-new-drawing.component.html',
    styleUrls: ['./dialog-create-new-drawing.component.scss'],
})
export class DialogCreateNewDrawingComponent {
    MIN_CANVAS_SIZE: number = 250;
    MAX_WIDTH_SIZE: number = 1920; // Selon le fichier .gitlab-ci.yml
    MAX_HEIGHT_SIZE: number = 1080; // Selon le fichier .gitlab-ci.yml
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
    ) {
        if (this.data) {
            this.message = data.message;
        }
        this.widthControl = this.fb.control(this.MIN_CANVAS_SIZE, [Validators.min(this.MIN_CANVAS_SIZE), Validators.max(this.MAX_WIDTH_SIZE)]);
        this.heightControl = this.fb.control(this.MIN_CANVAS_SIZE, [Validators.min(this.MIN_CANVAS_SIZE), Validators.max(this.MAX_HEIGHT_SIZE)]);
    }

    @HostListener('window:keydown.enter', ['$event']) onEnter(event: KeyboardEvent): void {
        this.onConfirmClick();
    }

    onConfirmClick(): void {
        if (
            this.widthControl.value >= this.MIN_CANVAS_SIZE &&
            this.widthControl.value <= this.MAX_WIDTH_SIZE &&
            this.heightControl.value >= this.MIN_CANVAS_SIZE &&
            this.heightControl.value <= this.MAX_HEIGHT_SIZE
        ) {
            this.dialogRef.close(true);
            if (!this.data) {
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            }
            this.router.navigate(['/editor']);
        }
    }
}
