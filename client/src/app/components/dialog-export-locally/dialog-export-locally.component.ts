import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { Filter } from '@app/classes/filter';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-dialog-export-locally',
    templateUrl: './dialog-export-locally.component.html',
    styleUrls: ['./dialog-export-locally.component.scss'],
})
export class DialogExportDrawingComponent implements AfterViewInit {
    isJPG = false;
    isPNG = false;

    whichFilter: Filter = Filter.NONE;

    nameFormControl: FormControl;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: Data, //private dialogRef: MatDialogRef<DialogExportDrawingComponent>
        private drawingService: DrawingService,
    ) {
        this.nameFormControl = new FormControl('default', Validators.pattern('[a-zA-Z ]*'));
    }

    @ViewChild('previewImage', { static: false }) previewImage: ElementRef<HTMLImageElement>;

    // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
    ngAfterViewInit(): void {
        this.previewImage.nativeElement.src = this.drawingService.convertBaseCanvasToBase64();
    }

    checkFirst(): void {
        this.whichFilter = Filter.BLUR;
        this.previewImage.nativeElement.style.filter = 'blur(4px)';
    }

    checkSecond(): void {
        this.whichFilter = Filter.GRAYSCALE;
        this.previewImage.nativeElement.style.filter = 'grayscale(100)';
    }

    checkThird(): void {
        this.whichFilter = Filter.INVERT;
        this.previewImage.nativeElement.style.filter = 'invert(50)';
    }

    checkFourth(): void {
        this.whichFilter = Filter.BRIGHTNESS;
        this.previewImage.nativeElement.style.filter = 'brightness(200)';
    }

    checkFifth(): void {
        this.whichFilter = Filter.SEPIA;
        this.previewImage.nativeElement.style.filter = 'sepia(50)';
    }
}
