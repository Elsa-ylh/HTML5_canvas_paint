import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[createNewDrawing]',
})
export class CreateNewDrawingDirective {
    @HostListener('mousedown') mouseDown() {
        alert("changer moi au dialogue d'Angular Material");
    }
}
