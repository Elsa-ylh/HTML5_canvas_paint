import { Component, Input } from '@angular/core';
import { dataUserGuide } from '@app/classes/data-guide';
import { UserGuide } from '@app/classes/interface-guide';
@Component({
    selector: 'app-write-text-user-guide',
    templateUrl: './write-text-user-guide.component.html',
    styleUrls: ['./write-text-user-guide.component.scss'],
})
export class WriteTextUserGuideComponent {
    dataGuides: UserGuide[];
    constructor() {
        this.dataGuides = dataUserGuide;
    }
    @Input() userGuide: UserGuide;
}
