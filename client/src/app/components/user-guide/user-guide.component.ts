import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WriteTextUserGuideComponent } from '@app/components/write-text-user-guide/write-text-user-guide.component';
@Component({
    selector: 'app-user-guide',
    templateUrl: './user-guide.component.html',
    styleUrls: ['./user-guide.component.scss'],
})
export class UserGuideComponent {
    constructor(public modal: MatDialog) {}
    openUserGuide(): void {
        const modalRef = this.modal.open(WriteTextUserGuideComponent, {
            width: '90%',
            height: '100%',
        });
        modalRef.afterClosed().subscribe((resul) => {
            console.log('closed help user');
        });
    }
}
