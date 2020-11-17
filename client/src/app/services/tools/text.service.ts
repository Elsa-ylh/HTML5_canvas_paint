import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { ToolGeneralInfo } from '@app/classes/tool-general-info';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

// https://css-tricks.com/snippets/javascript/javascript-keycodes/

// tslint:disable:deprecation
// const STROKECOLOR: string = "#000000";
const SPACE = 32;
const ARROWUP = 37;
const ARROWDOWN = 38;
const ARROWLEFT = 39;
const ARROWRIGHT = 40;
const DEL = 56;
const F1 = 112;
const F12 = 123;
const ZERO = 48;

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    // tslint:disable-next-line:no-magic-numbers
    sizeFont: number = 8; // minimal font size possible
    fontStyle: string = 'Montserrat';
    // tslint:disable-next-line:no-magic-numbers
    possibleSizeFont: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    // font size allowed for text -> autorized disable magical number
    possibleFont: string[] = ['Times New Roman', 'Calibri', 'Open Sans', 'Montserrat', 'Playfair Display'];
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    mousePosition: Vec2;
    canvasSelected: boolean;
    textTitle: string = 'Overlay text';
    keyHistory: string[] = [];
    stack: string[] = [];
    fontStyleBold: boolean = false;
    fontStyleItalic: boolean = false;
    height: number;
    width: number;
    private lineWidth: number = 2;
    textValue: string = 'initial value';
    log: string = '';
    writeOnCanvas: boolean = false;
    distanceX: number;
    distanceY: number;

    // imageLoader.addEventListener('change', handleImage, false);

    // xwindow.addEventListener('load', DrawPlaceholder)

    constructor(drawingService: DrawingService, private colorService: ColorService, private rectangleService: RectangleService) {
        super(drawingService);
    }

    formatLabel(value: number): number {
        return value;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        console.log(this.mouseEnter + '  ' + this.mouseOut + '  ' + this.mouseDown);
        if (this.mouseEnter && !this.mouseOut && this.mouseDown && !this.writeOnCanvas) {
            this.rectangleService.clearEffectTool();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.mousePosition = this.mouseDownCoord;
        }
        if (this.writeOnCanvas) {
            // this.baseCtx
            this.drawText();
            this.writeOnCanvas = false;
            this.clearEffectTool();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            // this.mousePosition=this.mouseDownCoord={x:0,y:0};
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.canvasSelected = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoord, this.mousePosition);
            this.mouseDown = false;
            this.writeOnCanvas = true;
        }
        // this.mouseDown = false;
        console.log('onMouseUp');
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown && this.mouseEnter && !this.mouseOut) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.height = mousePosition.y - this.mouseDownCoord.y;
            this.width = mousePosition.x - this.mouseDownCoord.x;
            this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoord, this.mousePosition);
            this.canvasSelected = false;
        }
    }

    onDoubleClick(event: MouseEvent): void {
        if ((this.mouseEnter || this.mouseOut) && this.writeOnCanvas) {
            console.log('test');
            this.writeOnCanvas = false;
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
    }

    setItalic(italic: boolean): void {
        this.fontStyleItalic = italic;
    }

    private getItalic(): string {
        return this.fontStyleItalic ? 'italic ' : '';
    }

    private getBold(): string {
        return this.fontStyleBold ? 'bold ' : '';
    }

    selectTextPosition(generalInfo: ToolGeneralInfo): void {
        if (generalInfo.canvasSelected) {
            switch (generalInfo.selectSubTool) {
                case SubToolselected.tool1: {
                    this.drawingService.baseCtx.textAlign = 'center';
                    break;
                }
                case SubToolselected.tool2: {
                    this.drawingService.baseCtx.textAlign = 'left';
                    break;
                }
                case SubToolselected.tool3: {
                    this.drawingService.baseCtx.textAlign = 'right';
                    break;
                }
            }
        }
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, mouseDownPos: Vec2, mousePosition: Vec2): void {
        if (this.drawingService.previewCtx === ctx) {
            if (mousePosition.x > mouseDownPos.x && mousePosition.y > mouseDownPos.y) {
                ctx.strokeRect(
                    mouseDownPos.x - this.lineWidth / 2,
                    mouseDownPos.y - this.lineWidth / 2,
                    this.width + this.lineWidth,
                    this.height + this.lineWidth,
                );
                return;
            }
            if (mousePosition.x < mouseDownPos.x && mousePosition.y < mouseDownPos.y) {
                ctx.strokeRect(
                    mouseDownPos.x + this.lineWidth / 2,
                    mouseDownPos.y + this.lineWidth / 2,
                    this.width - this.lineWidth,
                    this.height - this.lineWidth,
                );
                return;
            }
            if (mousePosition.x > mouseDownPos.x && mousePosition.y < mouseDownPos.y) {
                ctx.strokeRect(
                    mouseDownPos.x - this.lineWidth / 2,
                    mouseDownPos.y + this.lineWidth / 2,
                    this.width + this.lineWidth,
                    this.height - this.lineWidth,
                );
                return;
            }
            if (mousePosition.x < mouseDownPos.x && mousePosition.y > mouseDownPos.y) {
                ctx.strokeRect(
                    mouseDownPos.x + this.lineWidth / 2,
                    mouseDownPos.y - this.lineWidth / 2,
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
        // this.drawingService.baseCtx.font = "50px 'Calibri'";
        let textPreview = '';
        this.keyHistory.forEach((element) => {
            textPreview += element;
        });
        for (let index = this.stack.length - 1; index >= 0; index--) {
            const element = this.stack[index];
            textPreview += element;
        }
        this.drawingService.baseCtx.font = (this.getBold() + this.getItalic() + this.getSize() + 'px' + "'" + this.getFont() + "'").toString();
        this.drawingService.baseCtx.fillText(textPreview, this.mouseDownCoord.x, this.mouseDownCoord.y, this.width);
    }

    addletter(letter: string): void {
        this.keyHistory.push(letter);
        this.previewText();
    }

    private previewText(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawPreviewRect(this.drawingService.previewCtx, this.mouseDownCoord, this.mousePosition);
        let textPreview = '';
        this.keyHistory.forEach((element) => {
            textPreview += element;
        });
        textPreview += '|';
        for (let index = this.stack.length - 1; index >= 0; index--) {
            const element = this.stack[index];
            textPreview += element;
        }
        this.drawingService.previewCtx.font = (this.getBold() + this.getItalic() + this.getSize() + 'px' + "'" + this.getFont() + "'").toString();
        this.drawingService.previewCtx.fillText(textPreview, this.mouseDownCoord.x, this.mouseDownCoord.y, this.width);
    }

    arrowLeft(): void {
        if (this.keyHistory.length) {
            this.stack.push(this.keyHistory.pop() as string);
        }
        this.previewText();
    }
    arrowRight(): void {
        if (this.stack.length) {
            this.keyHistory.push(this.stack.pop() as string);
        }
        this.previewText();
    }
    backspace(): void {
        if (this.keyHistory.length) {
            this.keyHistory.pop();
        }
        this.previewText();
    }
    delete(): void {
        if (this.stack.length) {
            this.stack.pop();
        }
        this.previewText();
    }

    keyUpHandler(event: KeyboardEvent): void {
        if (this.writeOnCanvas) {
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
                    this.addletter(event.key.toString());
                    console.log(event.keyCode);
                }
        }
    }
    clearEffectTool(): void {
        this.keyHistory = [];
        this.stack = [];
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
