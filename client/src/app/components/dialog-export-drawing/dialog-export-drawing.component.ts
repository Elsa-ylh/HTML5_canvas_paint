import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';

@Component({
    selector: 'app-dialog-export-drawing',
    templateUrl: './dialog-export-drawing.component.html',
    styleUrls: ['./dialog-export-drawing.component.scss'],
})
export class DialogExportDrawingComponent {
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

    constructor(@Inject(MAT_DIALOG_DATA) private data: Data, private dialogRef: MatDialogRef<DialogExportDrawingComponent>) {
        this.nameFormControl = new FormControl('default', Validators.pattern('[a-zA-Z ]*'));
    }
}
