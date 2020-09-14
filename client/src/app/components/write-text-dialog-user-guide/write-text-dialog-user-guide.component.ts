import { Component, Input } from '@angular/core';
import { dataUserGuide } from '@app/classes/data-guide';
import { UserGuide } from '@app/classes/interface-guide';
@Component({
    selector: 'app-write-text-dialog-user-guide',
    templateUrl: './write-text-dialog-user-guide.component.html',
    styleUrls: ['./write-text-dialog-user-guide.component.scss'],
})
export class WriteTextDialogUserGuideComponent {
    dataGuides: UserGuide[];
    constructor() {
        this.dataGuides = dataUserGuide;
    }
    @Input() userGuide: UserGuide;
}
