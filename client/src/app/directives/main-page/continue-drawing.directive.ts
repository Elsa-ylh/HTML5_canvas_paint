import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[continueDrawing]',
})
export class ContinueDrawingDirective {
    @HostListener('mousedown') mouseDown() {
        alert('On continuera le dessin dans le Sprint 2.');
    }
}
