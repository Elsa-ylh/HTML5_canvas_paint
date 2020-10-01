import { Injectable } from '@angular/core';
import { RGBA } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '../drawing/drawing.service';

export enum GradientStyle {
    rainbow,
    lightToDark,
    colortoColor,
}

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private primaryColor: string = '#000000';
    private secondaryColor: string = '#ff6666';
    private selectedColor = this.primaryColor;
    private previewColor: string = '#ff6666';
    private primaryColorTransparency: number;
    private secondaryColorTransparency: number;
    clickprimaryColor: boolean = true;
    clicksecondaryColor: boolean = false;

    constructor(private drawingService: DrawingService) {}
    // private lastChoiceColor: RGB[];
    PositionSlider: number;
    getselectedColor(): string {
        return this.selectedColor;
    }
    // getters
    getpreviewColor(): string {
        return this.previewColor;
    }

    getprimaryColor(): string {
        return this.primaryColor;
    }

    getsecondaryColor(): string {
        return this.secondaryColor;
    }
    getprimaryColorTransparency(): number {
        return this.primaryColorTransparency;
    }
    // transparency
    getsecondaryColorTransparency(): number {
        return this.secondaryColorTransparency;
    }
    // setters
    setpreviewColor(colorPreview: string): void {
        this.previewColor = colorPreview;
    }

    setprimaryColor(colorPrimary: string): void {
        this.primaryColor = colorPrimary;
    }
    setsecondaryColor(colorSecondary: string): void {
        this.secondaryColor = colorSecondary;
    }
    setselectedColor(color: string): void {
        this.selectedColor = color;
    }
    // transparency
    setprimaryColorTransparency(primaryTransparency: number): void {
        this.primaryColorTransparency = primaryTransparency;
    }
    setsecondaryColorTransparency(secondaryTransparency: number): void {
        this.secondaryColorTransparency = secondaryTransparency;
    }

    // https://malcoded.com/posts/angular-color-picker/
    // I copied the gradient made at that position
    private rainbowGradient(gradient: CanvasGradient): void {
        // fractions make more sense to do seperation between colors
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1 / 6, 'rgba(255, 255, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(2.1 / 6, 'rgba(0, 255, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(3.1 / 6, 'rgba(0, 255, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(4.1 / 6, 'rgba(0, 0, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(5.1 / 6, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
    }

    // This one is completely my creation
    private lightToDark(gradient: CanvasGradient, hexColor: string): void {
        // fractions make more sense to do seperation between colors
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1 / 2, hexColor);
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    }
    // This gradient is used for the opacity. Made by tria
    private colortoColor(gradient: CanvasGradient, hexColor: string): void {
        // fractions make more sense to do seperation between colors
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1 / 2, hexColor);
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    }

    // Copyright all reserved to the respective author. Our work has been highly inspired by him and there is
    // is some form of paraphrasing and recoding to make it adapted to our use cases.
    // https://malcoded.com/posts/angular-color-picker/
    // Drawing a rainbow-gradient
    drawPalette(ctx: CanvasRenderingContext2D, dimension: Vec2, style: GradientStyle): void {
        ctx.clearRect(0, 0, dimension.x, dimension.y);
        let gradient;

        switch (style) {
            case GradientStyle.lightToDark:
                gradient = ctx.createLinearGradient(0, 0, dimension.x, 0);
                this.lightToDark(gradient, this.selectedColor);
                break;
            case GradientStyle.colortoColor:
                gradient = ctx.createLinearGradient(0, 0, dimension.x, 0);
                this.colortoColor(gradient, this.selectedColor);
                break;
            case GradientStyle.rainbow:
            default:
                gradient = ctx.createLinearGradient(0, 0, dimension.x, 0);
                this.rainbowGradient(gradient); // choose which gradient
                break;
        }

        ctx.beginPath();
        ctx.rect(0, 0, dimension.x, dimension.y);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    drawMovingDot(ctx: CanvasRenderingContext2D, dimension: Vec2, event: MouseEvent): void {
        ctx.clearRect(0, 0, dimension.x, dimension.y);
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#FFF';
        ctx.fillRect(event.offsetX, event.offsetY, 5, 5);
    }

    // Ce code est complètement inspiré sans gêne de
    // https://malcoded.com/posts/angular-color-picker/#detecting-mouse-events-on-the-color-slider
    getColor(position: Vec2, ctx: CanvasRenderingContext2D): RGBA {
        const imageData = ctx.getImageData(position.x, position.y, 1, 1).data;
        return { red: imageData[0], green: imageData[1], blue: imageData[2], alpha: 1 };
    }

    // change opacity of primary or secondary colors
    changeColorOpacity(value: number): void {
        if (this.clickprimaryColor && !this.clicksecondaryColor) {
            this.setprimaryColorTransparency(value);
            this.drawingService.baseCtx.globalAlpha = this.getprimaryColorTransparency();
            this.drawingService.previewCtx.globalAlpha = this.getprimaryColorTransparency();
        } else if (!this.clickprimaryColor && this.clicksecondaryColor) {
            this.setsecondaryColorTransparency(value);
            this.drawingService.baseCtx.globalAlpha = this.getsecondaryColorTransparency();
            this.drawingService.previewCtx.globalAlpha = this.getsecondaryColorTransparency();
        }
    }

    swapColor(): void {
        const temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }
    // We suppose that each number of the rgb space is between 0 to 255
    // Shameless copy paste of this link
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    numeralToHex(rgb: RGBA): string {
        const converter = (zeroTo256: number) => {
            const hex = zeroTo256.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + converter(rgb.red) + converter(rgb.green) + converter(rgb.blue);
    }
}
