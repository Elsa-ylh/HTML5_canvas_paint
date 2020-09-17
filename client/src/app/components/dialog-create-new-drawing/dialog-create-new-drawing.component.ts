import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Component({
    selector: 'app-dialog-create-new-drawing',
    templateUrl: './dialog-create-new-drawing.component.html',
    styleUrls: ['./dialog-create-new-drawing.component.scss'],
})
export class DialogCreateNewDrawingComponent implements OnInit {
    MIN_CANVAS_SIZE: number = 250;
    xAxis: number;
    yAxis: number;
    message: string = 'Êtes-vous sûr de vouloir effacer votre dessin actuel ?';

    formBuilder: FormBuilder;
    options: FormGroup;
    widthControl: FormControl = new FormControl(this.MIN_CANVAS_SIZE, [Validators.min(this.MIN_CANVAS_SIZE)]);
    heightControl: FormControl = new FormControl(this.MIN_CANVAS_SIZE, [Validators.min(this.MIN_CANVAS_SIZE)]);

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: Data,
        private dialogRef: MatDialogRef<DialogCreateNewDrawingComponent>,
        private drawingService: DrawingService,
    ) {
        if (this.data) {
            this.message = data.message;
        }
    }

    // La partie suivante n'est pas constructor() car il y a un bogue entre FormBuilder et MatDialog.
    // Ces deux objets instanciés dans le constructeur rend MatDialog impossible à voir correctement.
    ngOnInit(): void {
        this.formBuilder = new FormBuilder();
        this.options = this.formBuilder.group({
            width: this.widthControl,
            height: this.heightControl,
        });
    }

    @HostListener('window:keydown.enter', ['$event']) onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.onConfirmClick();
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
