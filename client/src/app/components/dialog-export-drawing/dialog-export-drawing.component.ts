import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';

@Component({
    selector: 'app-dialog-export-drawing',
    templateUrl: './dialog-export-drawing.component.html',
    styleUrls: ['./dialog-export-drawing.component.scss'],
})
export class DialogExportDrawingComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Data, public dialogRef: MatDialogRef<DialogExportDrawingComponent>) {}
}
