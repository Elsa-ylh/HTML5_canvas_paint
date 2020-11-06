import { AfterViewInit, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import { ColorService, GradientStyle, LastColor } from '@app/services/color/color.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';

const SIZE_OPACITY = 207;
const MAX_VALUE_RGB = 255;

@Component({
    selector: 'app-paint-bucket-color',
    templateUrl: './paint-bucket-color.component.html',
    styleUrls: ['./paint-bucket-color.component.scss'],
})
export class PaintBucketColorComponent implements AfterViewInit {
    readonly WIDTH: number = 207;
    readonly SQUARE_HEIGHT: number = 200;
    horizontalHeight: number = 20;
    private positionSlider: number;

    @ViewChild('previewSquare') previewSquare: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('squarePalette') squareCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewHorizontal') previewHorizontal: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('horizontalPalette') horizontalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('opacitySlider') opacitySliderCanvas: ElementRef<HTMLCanvasElement>; // to have an opacity slider
    @ViewChild('opacitySliderPreview') opacitySliderPreview: ElementRef<HTMLCanvasElement>; // to have a hover
    @ViewChild('message', { static: false }) messageRGB: TemplateRef<HTMLElement>;

    squareDimension: Vec2 = { x: this.WIDTH, y: this.SQUARE_HEIGHT };
    horizontalDimension: Vec2 = { x: this.WIDTH, y: this.horizontalHeight };

    previewSquareCtx: CanvasRenderingContext2D;
    squareCtx: CanvasRenderingContext2D;

    previewHorizontalCtx: CanvasRenderingContext2D;
    horizontalCtx: CanvasRenderingContext2D;

    opacitySliderCtx: CanvasRenderingContext2D;
    previewOpacitySliderCtx: CanvasRenderingContext2D;

    lastColors: LastColor[];

    color: string;

    constructor(public colorService: ColorService, public paintBucketService: PaintBucketService, public matDialog: MatDialog) {}

    ngAfterViewInit(): void {
        this.previewSquareCtx = this.previewSquare.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.squareCtx = this.squareCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewHorizontalCtx = this.previewHorizontal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.horizontalCtx = this.horizontalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable-next-line: use-isnan
        if (this.colorService.colorStopperPosition.offsetX !== NaN) {
            this.colorService.drawMovingStopper(
                this.previewHorizontalCtx,
                { x: this.WIDTH, y: this.horizontalHeight },
                this.colorService.colorStopperPosition,
            );
        }

        this.previewOpacitySliderCtx = this.opacitySliderPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.opacitySliderCtx = this.opacitySliderCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable-next-line: use-isnan
        if (this.colorService.alphaStopperPosition.offsetX !== NaN) {
            this.colorService.drawMovingStopper(
                this.previewOpacitySliderCtx,
                { x: this.WIDTH, y: this.horizontalHeight },
                this.colorService.alphaStopperPosition,
            );
        }

        this.drawSquarePalette();
        this.drawHorizontalPalette();
        this.drawOpacitySlider();
    }

    primaryClick(): void {
        this.colorService.isClicked = true;
    }
    secondaryClick(): void {
        this.colorService.isClicked = false;
    }

    drawSquarePalette(): void {
        this.colorService.drawPalette(this.squareCtx, this.squareDimension, GradientStyle.lightToDark);
    }
    drawHorizontalPalette(): void {
        this.colorService.drawPalette(this.horizontalCtx, this.horizontalDimension, GradientStyle.rainbow);
    }

    drawOpacitySlider(): void {
        this.colorService.drawPalette(this.opacitySliderCtx, this.horizontalDimension, GradientStyle.colorToColor);
    }

    onMouseOverSquare(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.previewColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.squareCtx));
    }

    onMouseOverSquareClick(event: MouseEvent): void {
        if (this.colorService.isClicked) {
            this.colorService.primaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.primaryColor);
        } else {
            this.colorService.secondaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.secondaryColor);
        }
        this.drawSquarePalette();
        this.drawOpacitySlider();
    }

    onMouseOverHorizontalClick(event: MouseEvent): void {
        if (this.colorService.isClicked) {
            this.colorService.primaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.primaryColor);
        } else {
            this.colorService.secondaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.secondaryColor);
        }
        this.colorService.selectedColor = this.colorService.previewColor;
        this.colorService.colorStopperPosition = event;
        this.colorService.drawMovingStopper(this.previewHorizontalCtx, { x: this.WIDTH, y: this.horizontalHeight }, event);
        this.drawSquarePalette();
        this.drawHorizontalPalette();
        this.drawOpacitySlider();
    }

    onMouseOverHorizontal(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.previewColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.horizontalCtx));
    }

    onMouseOverOpacitySliderClick(event: MouseEvent): void {
        this.drawOpacitySlider();
        this.colorService.alphaStopperPosition = event;
        this.colorService.drawMovingStopper(this.previewOpacitySliderCtx, { x: this.WIDTH, y: this.horizontalHeight }, event);
        this.colorService.changeColorOpacity(this.findPositionSlider(event)); // change opacity via the slider.
    }
    onMouseLastColorClick(event: MouseEvent, clickedColor: LastColor): boolean {
        if (clickedColor.active) {
            if (MouseButton.Left === event.button) {
                this.colorService.primaryColor = clickedColor.color as string;
            } else if (MouseButton.Right === event.button) {
                this.colorService.secondaryColor = clickedColor.color as string;
                return false;
            }
        }
        return true;
    }

    findPositionSlider(event: MouseEvent): number {
        const position = { x: event.offsetX, y: event.offsetY };
        this.positionSlider = 1 - position.x / SIZE_OPACITY;
        return this.positionSlider;
    }

    sendInput(rgb: RGBA): void {
        if (!rgb.red && !rgb.green && !rgb.blue && rgb.alpha >= 0 && rgb.alpha <= 1) {
            this.colorService.changeColorOpacity(rgb.alpha);
        } else if (rgb.red <= MAX_VALUE_RGB && rgb.green <= MAX_VALUE_RGB && rgb.blue <= MAX_VALUE_RGB && rgb.alpha <= 1 && rgb.alpha >= 0) {
            this.color = this.colorService.numeralToHex(rgb);
            this.colorService.primaryColor = this.color;
            this.colorService.changeColorOpacity(rgb.alpha);
        } else {
            this.openWarningMessage(this.messageRGB);
        }
    }

    openWarningMessage(templateRef: TemplateRef<HTMLElement>): void {
        this.matDialog.open(templateRef, {
            width: '300px',
        });
    }

    formatLabel(value: number): number {
        return value;
    }
}
