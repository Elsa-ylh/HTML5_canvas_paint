import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    private isDialogOpenSaveEport: boolean = false;
    onGoingDrawing: boolean;
    newDrawingRef: MatDialogRef<DialogCreateNewDrawingComponent>;
    dialogSaveRef: MatDialogRef<SaveDialogComponent>;
    checkDocumentationRef: MatDialogRef<WriteTextDialogUserGuideComponent>;
    constructor(public dialogCreator: MatDialog) {
        this.onGoingDrawing = false;
    }

    createNewDrawing(): void {
        this.newDrawingRef = this.dialogCreator.open(DialogCreateNewDrawingComponent, {
            data: { message: 'Créer un nouveau dessin' },
        });
    }

    isThereExistingDrawing(): boolean {
        return this.isDialogOpenSaveEport;
    }

    openSaveServer() {
        if (this.isDialogOpenSaveEport) {
            this.isDialogOpenSaveEport = false;
            this.dialogSaveRef = this.dialogCreator.open(SaveDialogComponent, {
                width: '90%',
                height: '90%',
            });
            this.dialogSaveRef.afterClosed().subscribe(() => {
                this.isDialogOpenSaveEport = true;
            });
        }
    }
    openUserGuide(): void {
        this.checkDocumentationRef = this.dialogCreator.open(WriteTextDialogUserGuideComponent, {
            width: '90%',
            height: '100%',
        });
    }
}
