import { Component, OnInit } from '@angular/core';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-write-text-option',
    templateUrl: './write-text-option.component.html',
    styleUrls: ['./write-text-option.component.scss'],
})
export class WriteTextOptionComponent implements OnInit {
    private itItalic: boolean;
    private itBold: boolean;
    constructor(public textService: TextService) {}

    ngOnInit(): void {
        this.itBold = false;
        this.itItalic = false;
    }
    pickText(): void {
        this.itItalic = !this.itItalic;
        this.itBold = !this.itBold;
    }
}
