import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { Vec2 } from '@app/classes/vec2';

@Component({
    selector: 'app-dialog-export-locally',
    templateUrl: './dialog-export-locally.component.html',
    styleUrls: ['./dialog-export-locally.component.scss'],
})
export class DialogExportDrawingComponent implements AfterViewInit {
    isJPG = false;
    isPNG = false;

    // change the name of the filter when effect has been chosen
    whichFilter = new Map([
        ['filterOne', false],
        ['filterTwo', false],
        ['filterThree', false],
        ['filterFour', false],
        ['filterFive', false],
    ]);

    nameFormControl: FormControl;
    private imgReducerCanvas: HTMLCanvasElement;
    private imgReducerCtx: CanvasRenderingContext2D;
    private previewImgSize: Vec2 = { x: 300, y: 300 } as Vec2;

    constructor(@Inject(MAT_DIALOG_DATA) private data: Data, private dialogRef: MatDialogRef<DialogExportDrawingComponent>) {
        this.nameFormControl = new FormControl('default', Validators.pattern('[a-zA-Z ]*'));
        this.imgReducerCanvas = document.createElement('canvas');
        this.imgReducerCtx = this.imgReducerCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    @ViewChild('previewImage', { static: false }) previewImage: ElementRef<HTMLImageElement>;

    // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
    ngAfterViewInit(): void {
        this.imgReducerCtx.drawImage();
        this.previewImage.nativeElement.src = 'assets/leaf.svg';
    }
}
