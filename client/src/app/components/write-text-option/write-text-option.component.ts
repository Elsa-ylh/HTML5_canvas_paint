import { Component, HostListener, OnInit } from '@angular/core';
import { ToolUsed } from '@app/classes/tool';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-write-text-option',
    templateUrl: './write-text-option.component.html',
    styleUrls: ['./write-text-option.component.scss'],
})
export class WriteTextOptionComponent implements OnInit {
    private itItalic: boolean;
    private itBold: boolean;
    // private isTextChecked: boolean = false;
    // tslint:disable-next-line: typedef
    toolUsed = ToolUsed;
    constructor(public textService: TextService) {}

    ngOnInit(): void {
        this.itBold = false;
        this.itItalic = false;
    }

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
        event.preventDefault();
        this.textService.keyUpHandler(event);
    }

    @HostListener('window:keydown.ArrowLeft', ['$event']) onLeftArrow(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.arrowLeft();
        console.log('arrowLeft');
    }

    @HostListener('window:keydown.ArrowRight', ['$event']) onRightArrow(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.arrowRight();
        console.log('arrowRight');
    }

    @HostListener('window:keydown.Enter', ['$event']) onEnter(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.enter();
        console.log('enter');
    }

    @HostListener('window:keydown.Escape', ['$event']) onEscape(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.clearEffectTool();
        console.log('escape');
    }

    @HostListener('window:keydown.Delete', ['$event']) onDelete(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.delete();
        console.log('delete');
    }

    @HostListener('window:keydown.Backspace', ['$event']) onBackSpace(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.backspace();
        console.log('backSpace');
    }
}
