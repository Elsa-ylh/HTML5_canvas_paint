import { Component } from '@angular/core';
import { dataUserGuide } from '@app/classes/user-guide-data';
import { UserGuide } from '@app/classes/interface-guide';
@Component({
    selector: 'app-write-text-dialog-user-guide',
    templateUrl: './write-text-dialog-user-guide.component.html',
    styleUrls: ['./write-text-dialog-user-guide.component.scss'],
})
export class WriteTextDialogUserGuideComponent {
    dataGuides: UserGuide[];
    private selectionList: string;
    constructor() {
        this.dataGuides = dataUserGuide;
        this.diversListSelection();
    }
    diversListSelection(): void {
        this.selectionList = 'Divers';
    }
    drawListSelection(): void {
        this.selectionList = 'Dessiner';
    }
    testDataGuide(txt: string): boolean {
        return txt === this.selectionList;
    }
}
