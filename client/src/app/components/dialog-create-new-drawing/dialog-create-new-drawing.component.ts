import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-create-new-drawing',
    templateUrl: './dialog-create-new-drawing.component.html',
    styleUrls: ['./dialog-create-new-drawing.component.scss'],
})
export class DialogCreateNewDrawingComponent {
    xAxis: number;
    yAxis: number;

    constructor(public dialogRef: MatDialogRef<DialogCreateNewDrawingComponent>) {}
}
