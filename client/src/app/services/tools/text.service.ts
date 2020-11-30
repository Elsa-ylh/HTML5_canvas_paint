import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { TextControl } from '@app/classes/text-control';
import { Tool } from '@app/classes/tool';
// import { TextAction } from '@app/classes/undo-redo/text-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// https://css-tricks.com/snippets/javascript/javascript-keycodes/

// tslint:disable:deprecation
// tslint:disable:max-file-line-count
const STROKECOLOR = '#000000';
const SPACE = 32;
const ARROWUP = 37;
const ARROWDOWN = 38;
const ARROWLEFT = 39;
const ARROWRIGHT = 40;
const DEL = 56;
const F1 = 112;
const F12 = 123;
const ZERO = 48;
const DOTTEDSPACE = 10;
const TEXTZONEMINWIDTH = 100;

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    fontStyle: string = 'Times New Roman';
    // tslint:disable-next-line:no-magic-numbers
    possibleSizeFont: number[] = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 23, 34, 36, 38, 40, 48, 60, 72];
    // different font sizes allowed for text -> authorized disable magical number
    // tslint:disable-next-line:no-magic-numbers
    sizeFont: number = this.possibleSizeFont[6];
    possibleFont: string[] = ['Times New Roman', 'Calibri', 'Courier New', 'Verdana', 'Impact'];
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    mousePosition: Vec2 = { x: 0, y: 0 };
    canvasSelected: boolean;
    keyHistory: string[] = [];
    stack: string[] = [];
    fontStyleBold: boolean = false;
    fontStyleItalic: boolean = false;
    height: number = 0;
    width: number = 0;
    private lineWidth: number = 2;
    textValue: string = 'initial value';
    log: string = '';
    writeOnPreviewCtx: boolean = false;
    distanceX: number = 0;
    distanceY: number = 0;
    private textAlign: number = 2;
    private textControl: TextControl;
    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
        this.textControl = new TextControl(this.drawingService.previewCtx, this.sizeFont);
    }

    formatLabel(value: number): number {
        return value;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseEnter && !this.mouseOut && this.mouseDown && !this.writeOnPreviewCtx) {
            this.mouseDownCoords = this.getPositionFromMouse(event);
            this.mousePosition = this.mouseDownCoords;
            this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoords, this.mousePosition);
        }
        if (this.writeOnPreviewCtx) {
            this.drawText();
            // const textAction = new TextAction(
            //   this.mousePosition,
            //   this.mouseDownCoords,
            //   this.colorService.primaryColor,
            //   this.sizeFont, this.fontStyle,
            //   this.textAlign,
            //   this.fontStyleItalic,
            //   this.fontStyleBold,
            //   this.subToolSelect,
            //   this,
            //   this.drawingService
            //   );
            // this.undoRedoService.addUndo(textAction);
            this.undoRedoService.clearRedo();

            this.writeOnPreviewCtx = false;
            this.clearEffectTool();
            this.mouseDownCoords = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.canvasSelected = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoords, this.mousePosition);
            this.mouseDown = false;
            this.writeOnPreviewCtx = true;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown && this.mouseEnter && !this.mouseOut) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.height = mousePosition.y - this.mouseDownCoords.y;
            this.width = mousePosition.x - this.mouseDownCoords.x;
            this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoords, this.mousePosition);
            this.canvasSelected = false;
        }
    }

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseOut = true;
            // this.mouseEnter = false;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.mouseEnter = true;
        this.mouseOut = false;
    }

    private getSize(): number {
        return this.sizeFont;
    }

    private getFont(): string {
        return this.fontStyle;
    }

    setBold(bold: boolean): void {
        this.fontStyleBold = bold;
        this.previewText();
    }

    setItalic(italic: boolean): void {
        this.fontStyleItalic = italic;
        this.previewText();
    }

    private getItalic(): string {
        return this.fontStyleItalic ? 'italic ' : '';
    }

    private getBold(): string {
        return this.fontStyleBold ? 'bold ' : '';
    }

    selectTextPosition(subTool: number): void {
        this.textAlign = subTool;
        switch (subTool) {
            case SubToolselected.tool1: {
                this.drawingService.previewCtx.textAlign = 'center';
                this.drawingService.baseCtx.textAlign = 'center';
                break;
            }
            case SubToolselected.tool2: {
                this.drawingService.previewCtx.textAlign = 'left';
                this.drawingService.baseCtx.textAlign = 'left';
                break;
            }
            case SubToolselected.tool3: {
                this.drawingService.previewCtx.textAlign = 'right';
                this.drawingService.baseCtx.textAlign = 'right';
                break;
            }
        }
        this.previewText();
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, mouseDownCoord: Vec2, mousePosition: Vec2): void {
        this.distanceX = mousePosition.x - mouseDownCoord.x;
        this.distanceY = mousePosition.y - mouseDownCoord.y;
        ctx.strokeStyle = STROKECOLOR;
        ctx.fillStyle = STROKECOLOR;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([DOTTEDSPACE, DOTTEDSPACE]);
        if (this.drawingService.previewCtx === ctx) {
            if (Math.abs(this.width) <= TEXTZONEMINWIDTH || Math.abs(this.height) <= this.sizeFont) {
                this.width = Math.abs(this.width) > TEXTZONEMINWIDTH ? this.width : TEXTZONEMINWIDTH;
                this.height = Math.abs(this.height) > this.sizeFont ? this.height : this.sizeFont + 1;
            }
            this.textControl.setHeight(this.height);
            this.textControl.setWidth(this.width);
            if (mousePosition.x >= mouseDownCoord.x && mousePosition.y >= mouseDownCoord.y) {
                ctx.strokeRect(
                    mouseDownCoord.x - this.lineWidth / 2,
                    mouseDownCoord.y - this.lineWidth / 2,
                    this.width + this.lineWidth,
                    this.height + this.lineWidth,
                );

                return;
            }
            if (mousePosition.x < mouseDownCoord.x && mousePosition.y < mouseDownCoord.y) {
                ctx.strokeRect(
                    mouseDownCoord.x + this.lineWidth / 2,
                    mouseDownCoord.y + this.lineWidth / 2,
                    this.width - this.lineWidth,
                    this.height - this.lineWidth,
                );
                return;
            }
            if (mousePosition.x > mouseDownCoord.x && mousePosition.y < mouseDownCoord.y) {
                ctx.strokeRect(
                    mouseDownCoord.x - this.lineWidth / 2,
                    mouseDownCoord.y + this.lineWidth / 2,
                    this.width + this.lineWidth,
                    this.height - this.lineWidth,
                );
                return;
            }
            if (mousePosition.x < mouseDownCoord.x && mousePosition.y > mouseDownCoord.y) {
                ctx.strokeRect(
                    mouseDownCoord.x + this.lineWidth / 2,
                    mouseDownCoord.y - this.lineWidth / 2,
                    this.width - this.lineWidth,
                    this.height + this.lineWidth,
                );
                return;
            }
        }
    }

    drawText(): void {
        this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor; // text color
        this.drawingService.baseCtx.fillStyle = this.colorService.primaryColor;
        const textPreview: string[] = this.textControl.getText();
        // let indexLine = 0;
        // textPreview[indexLine] = '';

        // this.keyHistory.forEach((element) => {
        //     if (element === '\n') {
        //         textPreview.push('');
        //         indexLine++;
        //     } else {
        //         if (!this.checkWidthText(this.drawingService.baseCtx, textPreview[indexLine] + element)) {
        //             textPreview.push('');
        //             indexLine++;
        //         }
        //         textPreview[indexLine] += element;
        //     }
        // });
        // for (let index = this.stack.length - 1; index >= 0; index--) {
        //     const element = this.stack[index];
        //     if (element === '\n') {
        //         textPreview.push('');
        //         indexLine++;
        //     } else {
        //         if (!this.checkWidthText(this.drawingService.baseCtx, textPreview[indexLine] + element)) {
        //             textPreview.push('');
        //             indexLine++;
        //         }
        //         textPreview[indexLine] += element;
        //     }
        // }
        this.position(this.drawingService.baseCtx, textPreview, this.textAlign);
    }

    previewText(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoords, this.mousePosition);
        const textPreview: string[] = this.textControl.getTextWithCursor();
        // let indexLine = 0;
        // textPreview[indexLine] = '';
        // this.keyHistory.forEach((element) => {
        //     if (element === '\n') {
        //         textPreview.push('');
        //         indexLine++;
        //     } else {
        //         if (!this.checkWidthText(this.drawingService.previewCtx, textPreview[indexLine] + element)) {
        //             textPreview.push('');
        //             indexLine++;
        //         }
        //         textPreview[indexLine] += element;
        //     }
        // });
        // textPreview[indexLine] += '|';
        // for (let index = this.stack.length - 1; index >= 0; index--) {
        //     const element = this.stack[index];
        //     if (element === '\n') {
        //         textPreview.push('');
        //         indexLine++;
        //     } else {
        //         if (!this.checkWidthText(this.drawingService.previewCtx, textPreview[indexLine] + element)) {
        //             textPreview.push('');
        //             indexLine++;
        //         }
        //         textPreview[indexLine] += element;
        //     }
        // }
        console.log(textPreview, 'test preview');
        this.position(this.drawingService.previewCtx, textPreview, this.textAlign);
    }

    private xTop(width: number): number {
        return (this.mouseDownCoords.x < this.mousePosition.x ? this.mouseDownCoords.x : this.mousePosition.x) + width;
    }

    private yTop(): number {
        return (this.mouseDownCoords.y < this.mousePosition.y ? this.mouseDownCoords.y : this.mousePosition.y) + this.sizeFont;
    }

    // private checkWidthText(ctx: CanvasRenderingContext2D, text: string): boolean {
    //   return Math.abs(ctx.measureText(text).width) <= Math.abs(this.width);
    // }
    private checkHeightText(nbLineBreak: number): boolean {
        return (nbLineBreak + 1) * this.sizeFont <= Math.abs(this.height + 1);
    }
    private position(ctx: CanvasRenderingContext2D, texts: string[], align: number): void {
        // set font and size for text with or without italic or bold
        ctx.font = (this.getBold() + this.getItalic() + this.getSize() + 'px' + "'" + this.getFont() + "'").toString();
        this.textControl.setCtx(ctx);
        let lineBreak = 0;
        // get string []= this.textControl
        switch (align) {
            case SubToolselected.tool1:
                texts.forEach((element) => {
                    if (this.checkHeightText(lineBreak)) {
                        ctx.fillText(element, this.xTop(this.width / 2), this.yTop() + lineBreak * this.sizeFont, Math.abs(this.width));
                        lineBreak++;
                    }
                });
                break;
            case SubToolselected.tool2:
                texts.forEach((element) => {
                    if (this.checkHeightText(lineBreak)) {
                        ctx.fillText(element, this.xTop(0), this.yTop() + lineBreak * this.sizeFont, Math.abs(this.width));
                        lineBreak++;
                    }
                });
                break;
            case SubToolselected.tool3:
                texts.forEach((element) => {
                    if (this.checkHeightText(lineBreak)) {
                        ctx.fillText(element, this.xTop(this.width), this.yTop() + lineBreak * this.sizeFont, Math.abs(this.width));
                        lineBreak++;
                    }
                });
                break;
        }
    }
    arrowTop(): void {
        this.textControl.arrowTop();
        this.previewText();
    }
    arrowBottom(): void {
        this.textControl.arrowBottom();
        this.previewText();
    }

    arrowLeft(): void {
        this.textControl.arrowLeft();
        this.previewText();
    }

    arrowRight(): void {
        this.textControl.arrowRight();
        this.previewText();
    }

    backspace(): void {
        this.textControl.backspace();
        this.previewText();
    }

    delete(): void {
        this.textControl.delete();
        this.previewText();
    }

    enter(): void {
        this.textControl.enter();
        this.previewText();
    }

    keyUpHandler(event: KeyboardEvent): void {
        if (this.writeOnPreviewCtx) {
            if (
                event.keyCode === SPACE ||
                (event.keyCode >= ZERO &&
                    event.keyCode !== DEL &&
                    event.keyCode !== ARROWLEFT &&
                    event.keyCode !== ARROWDOWN &&
                    event.keyCode !== ARROWRIGHT &&
                    event.keyCode !== ARROWUP)
            )
                if (event.keyCode < F1 || event.keyCode > F12) {
                    this.textControl.addLetter(event.key.toString());
                    this.previewText();
                }
        }
    }

    clearEffectTool(): void {
        this.textControl.clearText();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    clearPreviewCtx(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
