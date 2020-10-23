import { Component } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-dropper-color',
    templateUrl: './dropper-color.component.html',
    styleUrls: ['./dropper-color.component.scss'],
})
export class DropperColorComponent {
    constructor(public colorService: ColorService) {}
}
