import { Component, HostListener } from '@angular/core';
import { ToolUsed } from '@app/classes/tool';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-write-text-option',
    templateUrl: './write-text-option.component.html',
    styleUrls: ['./write-text-option.component.scss'],
})
export class WriteTextOptionComponent {
    private itItalic: boolean = false;
    private itBold: boolean = false;
    // private isTextChecked: boolean = false;
    // tslint:disable-next-line: typedef
    toolUsed = ToolUsed;
    constructor(public textService: TextService) {}

    /* get textChecked(): boolean {
        return this.isTextChecked;
    }*/

    pickBold(): void {
        this.itBold = !this.itBold;
        this.textService.setBold(this.itBold);
    }
    pickItalic(): void {
        this.itItalic = !this.itItalic;
        this.textService.setItalic(this.itItalic);
    }

    pickFontStyle(subTool: number): void {
        this.textService.selectTextPosition(subTool);
    }

    /* resetCheckedButton(): void {
        this.isTextChecked = false;
    }*/

    @HostListener('window:keydown', ['$event']) keyUpHandler(event: KeyboardEvent): void {
        if (this.textService.isOnPreviewCanvas()) event.preventDefault();
        this.textService.keyUpHandler(event);
    }

    @HostListener('window:keydown.ArrowLeft', ['$event']) onLeftArrow(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.arrowLeft();
    }
    @HostListener('window:keydown.ArrowRight', ['$event']) onRightArrow(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.arrowRight();
    }

    @HostListener('window:keydown.ArrowUp', ['$event']) onTopArrow(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.arrowTop();
        console.log('Up');
    }

    @HostListener('window:keydown.ArrowDown', ['$event']) onBottomArrow(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.arrowBottom();
        console.log('down');
    }

    @HostListener('window:keydown.Enter', ['$event']) onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.enter();
    }

    @HostListener('window:keydown.Escape', ['$event']) onEscape(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.clearEffectTool();
    }

    @HostListener('window:keydown.Delete', ['$event']) onDelete(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.delete();
    }

    @HostListener('window:keydown.Backspace', ['$event']) onBackSpace(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.backspace();
    }
}
