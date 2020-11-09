import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    sizeFont: number = 0;
    colorFont: string = this.colorService.primaryColor;
    // tslint:disable-next-line:no-magic-numbers
    possibleSizeFont: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    // font size allowed for text -> autorized disable magical number
    possibleFont: string[] = ['Times New Roman', 'Calibri', 'Open Sans', 'Montserrat', 'Playfair Display'];

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
    }

    formatLabel(value: number): number {
        return value;
    }
}
