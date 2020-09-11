import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[openCarousel]',
})
export class OpenCarouselDirective {
    @HostListener('mousedown') mouseDown() {
        alert('Un dialogue pour le carousel des dessins pour plus tard');
    }
}
