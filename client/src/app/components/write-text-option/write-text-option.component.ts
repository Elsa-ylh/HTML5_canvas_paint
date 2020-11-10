import { Component, OnInit } from '@angular/core';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-write-text-option',
    templateUrl: './write-text-option.component.html',
    styleUrls: ['./write-text-option.component.scss'],
})
export class WriteTextOptionComponent implements OnInit {
    constructor(public textService: TextService) {}

    ngOnInit(): void {}
    pickText(): void {}
}
