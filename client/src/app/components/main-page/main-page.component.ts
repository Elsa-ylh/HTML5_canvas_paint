import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { DialogCreateNewDrawingComponent } from 'src/app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    onGoingDrawing: boolean;
    newDrawingRef: MatDialogRef<DialogCreateNewDrawingComponent>;
    checkDocumentationRef: MatDialogRef<WriteTextDialogUserGuideComponent>;
    constructor(private dialog: MatDialog) {
        this.onGoingDrawing = false;
    }

    createNewDrawing(): void {
        this.newDrawingRef = this.dialog.open(DialogCreateNewDrawingComponent, {
            data: { message: 'Créer un nouveau dessin avec les dimensions suivantes' },
        });
    }

    openUserGuide(): void {
        this.checkDocumentationRef = this.dialog.open(WriteTextDialogUserGuideComponent, {
            width: '90%',
            height: '100%',
        });
    }
}
