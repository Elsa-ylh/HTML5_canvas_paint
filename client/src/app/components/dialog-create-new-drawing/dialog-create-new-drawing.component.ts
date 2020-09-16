import { Component, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Component({
    selector: 'app-dialog-create-new-drawing',
    templateUrl: './dialog-create-new-drawing.component.html',
    styleUrls: ['./dialog-create-new-drawing.component.scss'],
})
export class DialogCreateNewDrawingComponent {
    MIN_CANVAS_SIZE = 250;
    xAxis: number;
    yAxis: number;
    message: string = 'Êtes-vous sur de vouloir effacer votre dessin actuel ?';

    options: FormGroup;
    widthControl = new FormControl(this.MIN_CANVAS_SIZE, [Validators.min(this.MIN_CANVAS_SIZE)]);
    heightControl = new FormControl(this.MIN_CANVAS_SIZE, [Validators.min(this.MIN_CANVAS_SIZE)]);
    favoriteAnimal = 'Dog';

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: Data,
        private dialogRef: MatDialogRef<DialogCreateNewDrawingComponent>,
        private drawingService: DrawingService,
    ) {
        if (this.data) {
            this.message = data.message;
        }
    }

    @HostListener('window:keydown.enter', ['$event']) onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.onConfirmClick();
    }

    // The following line had to be on ngOnInit lifecycle as constructor breaks when MatDialogRed and FormBuilder
    // are on the same construction line.
    ngOnInit(fb: FormBuilder): void {
        this.options = fb.group({
            width: this.widthControl,
            height: this.heightControl,
        });
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
