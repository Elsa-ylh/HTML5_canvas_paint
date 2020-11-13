import { Component, HostListener, OnInit } from '@angular/core';
import { ToolUsed } from '@app/classes/tool';
import { ToolService } from '@app/services/tool-service';
import { TextService } from '@app/services/tools/text.service';

@Component({
    selector: 'app-write-text-option',
    templateUrl: './write-text-option.component.html',
    styleUrls: ['./write-text-option.component.scss'],
})
export class WriteTextOptionComponent implements OnInit {
    private itItalic: boolean;
    private itBold: boolean;
    private isTextChecked: boolean = false;
    // tslint:disable-next-line: typedef
    toolUsed = ToolUsed;
    constructor(public textService: TextService, private toolService: ToolService) {}

    ngOnInit(): void {
        this.itBold = false;
        this.itItalic = false;
    }
    /*
    pickText(): void {
      this.drawingService.cursorUsed = 'text';
      this.toolService.switchTool(ToolUsed.Text);
  }
*/
    get textChecked(): boolean {
        return this.isTextChecked;
    }

    pickBold(): void {
        this.itBold = !this.itBold;
        this.textService.setBold(this.itBold);
    }
    pickItalic(): void {
        this.itItalic = !this.itItalic;
        this.textService.setItalic(this.itItalic);
    }

    pickFontStyle(subTool: number): void {
        this.toolService.switchTool(ToolUsed.Text);
        this.toolService.currentTool.subToolSelect = subTool;
    }

    resetCheckedButton(): void {
        this.isTextChecked = false;
    }

    @HostListener('window:keydown', ['$event']) keyUpHandler(event: KeyboardEvent): void {
        this.textService.keyUpHandler(event);
        console.log('tout les touceh');
    }

    @HostListener('window:keydown.ArrowLeft', ['$event']) onLeftArrow(event: KeyboardEvent): void {
        console.log('arrowLeft');
    }

    @HostListener('window:keydown.ArrowRight', ['$event']) onRightArrow(event: KeyboardEvent): void {
        console.log('arrowRight');
    }
    @HostListener('window:keydown.Enter', ['$event']) onEnter(event: KeyboardEvent): void {
        console.log('enter');
    }

    @HostListener('window:keydown.Delete', ['$event']) onDelete(event: KeyboardEvent): void {
        console.log('delete');
    }
    @HostListener('window:keydown.Escape', ['$event']) onEscape(event: KeyboardEvent): void {
        console.log('escape');
    }

    @HostListener('window:keydown.Backspace', ['$event']) onBackSpace(event: KeyboardEvent): void {
        console.log('backSpace');
    }
}
