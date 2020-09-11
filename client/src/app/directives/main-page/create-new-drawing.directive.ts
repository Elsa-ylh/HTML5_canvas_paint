import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[createNewDrawing]',
})
export class CreateNewDrawingDirective {
    @HostListener('mousedown') mouseDown() {
        console.log('fuck you mofos');
    }
}
