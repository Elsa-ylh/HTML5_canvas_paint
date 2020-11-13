import { Component, OnInit } from '@angular/core';
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
}
