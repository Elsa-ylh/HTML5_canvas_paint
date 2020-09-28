import { Component, ElementRef, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/tools/color-service';

// certaines parties du code a ete inspiree de l'auteur
@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})

// The following code has been highly inspired but not copied from this website
// https://malcoded.com/posts/angular-color-picker/
export class ColorComponent {
    @ViewChild('roundPalette', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('horizontalPalette', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    constructor(private colorService: ColorService) {
        this.colorService.fillRoundPalette(); // test method
    }

    fillRoundPalette(): void {}

    fillHorizontalPalette(): void {}
}
