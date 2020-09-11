import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[openDocumentation]',
})
export class OpenDocumentationDirective {
    @HostListener('mousedown') mouseDown() {
        alert('Ouvrir la documentation');
    }
}
