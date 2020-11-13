import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool } from '@app/classes/tool';
import { ToolGeneralInfo } from '@app/classes/tool-general-info';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

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
    imageLoader: HTMLElement | null = document.getElementById('imageLoader');
    img: HTMLImageElement = new Image();
    keyHistory: string = '';
    fontStyleBold: boolean = false;
    fontStyleItalic: boolean = false;
    // imageLoader.addEventListener('change', handleImage, false);

    // xwindow.addEventListener('load', DrawPlaceholder)

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
    }

    formatLabel(value: number): number {
        return value;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.clearEffectTool();
        if (this.mouseEnter) {
            this.onMouseUp(event);
        }
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
        this.mousePosition = this.mouseDownCoord;
        this.drawText();
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.canvasSelected = true;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.mousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.canvasSelected = false;
        }
    }

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseOut = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseOut) {
            this.mouseEnter = true;
        }
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

    drawText(): void {
        this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor; // text color
        this.drawingService.baseCtx.fillStyle = this.colorService.primaryColor;
        // this.drawingService.baseCtx.font = "50px 'Calibri'";
        this.drawingService.baseCtx.font = (this.getBold() + this.getItalic() + this.getSize() + 'px' + "'" + this.getFont() + "'").toString();
        this.drawingService.baseCtx.fillText(this.textTitle, this.mouseDownCoord.x, this.mouseDownCoord.y);
    }

    addletter(letter: string): void {
        window.addEventListener('keyup', this.keyUpHandler, true);
        this.keyHistory += letter;
        // tslint:disable-next-line:no-magic-numbers
        this.drawingService.baseCtx.clearRect(0, 0, 300, 300);
        // tslint:disable-next-line:no-magic-numbers
        this.drawingService.baseCtx.fillText(this.keyHistory, 20, 20);
    }

    keyUpHandler(event: KeyboardEvent): void {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const key = (event.key as unknown) as number;
        // tslint:disable-next-line:no-magic-numbers
        if (key > 64 && key < 91) {
            // tslint:disable-next-line:no-magic-numbers
            const letter = letters.substring(key - 64, key - 65);
            this.addletter(letter);
        }
    }
}
