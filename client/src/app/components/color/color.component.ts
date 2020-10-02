import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import { ColorService, GradientStyle, LastColor } from '@app/services/color/color.service';

// certaines parties du code a ete inspiree de l'auteur
const SIZE_OPACITY = 207;
const MAX_VALUE_RGB = 255;
@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
// The following code has been highly inspired but not copied from this website
// The website mainly teach how to do the drawing with canvas2d the gradient
// https://malcoded.com/posts/angular-color-picker/
export class ColorComponent implements AfterViewInit {
    // This will force the usage of the entire CSS width. It is a poor man's fix as I found nothing else.
    // Please tolerate such heresy :)

    // tslint:disable-next-line:no-magic-numbers
    width: number = 207;
    // tslint:disable-next-line:no-magic-numbers
    squareHeight: number = 200;
    // tslint:disable-next-line:no-magic-numbers
    horizontalHeight: number = 20;
    // tslint:disable-next-line:no-magic-numbers
    positionSlider: number;

    @ViewChild('previewSquare') previewSquare: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('squarePalette') squareCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewHorizontal') previewHorizontal: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('horizontalPalette') horizontalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('opacitySlider') opacitySliderCanvas: ElementRef<HTMLCanvasElement>; // to have an opacity slider
    @ViewChild('opacitySliderPreview') opacitySliderPreview: ElementRef<HTMLCanvasElement>; // to have an opacity slider
    @ViewChild('message', { static: false }) messageRGB: MatDialogRef<HTMLElement>;
    @ViewChild('message', { static: false }) messageAlpha: MatDialogRef<HTMLElement>;

    squareDimension: Vec2 = { x: this.width, y: this.squareHeight };
    horizontalDimension: Vec2 = { x: this.width, y: this.horizontalHeight };

    previewSquareCtx: CanvasRenderingContext2D;
    squareCtx: CanvasRenderingContext2D;

    previewHorizontalCtx: CanvasRenderingContext2D;
    horizontalCtx: CanvasRenderingContext2D;

    opacitySliderCtx: CanvasRenderingContext2D;
    previewopacitySliderCtx: CanvasRenderingContext2D;
    lastColors: LastColor[];

    color: string;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        public colorService: ColorService,
        public matDialog: MatDialog,
    ) {
        this.lastColors = this.colorService.getlastColors();
        this.iconRegistry.addSvgIcon('red', this.sanitizer.bypassSecurityTrustResourceUrl('assets/apple.svg'));
        this.iconRegistry.addSvgIcon('green', this.sanitizer.bypassSecurityTrustResourceUrl('assets/leaf.svg'));
        this.iconRegistry.addSvgIcon('blue', this.sanitizer.bypassSecurityTrustResourceUrl('assets/wave.svg'));
        this.iconRegistry.addSvgIcon('alpha', this.sanitizer.bypassSecurityTrustResourceUrl('assets/transparency.svg'));
    }

    ngAfterViewInit(): void {
        this.previewSquareCtx = this.previewSquare.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.squareCtx = this.squareCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewHorizontalCtx = this.previewHorizontal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.horizontalCtx = this.horizontalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewopacitySliderCtx = this.opacitySliderPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.opacitySliderCtx = this.opacitySliderCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.drawSquarePalette();
        this.drawHorizontalPalette();
        this.drawOpacitySlider();
    }

    // change between primary and sec
    primaryClick(): void {
        this.colorService.isclicked = true;
    }
    secondaryClick(): void {
        this.colorService.isclicked = false;
    }

    drawSquarePalette(): void {
        this.colorService.drawPalette(this.squareCtx, this.squareDimension, GradientStyle.lightToDark);
    }
    drawHorizontalPalette(): void {
        this.colorService.drawPalette(this.horizontalCtx, this.horizontalDimension, GradientStyle.rainbow);
    }

    drawOpacitySlider(): void {
        // on cree la palette
        this.colorService.drawPalette(this.opacitySliderCtx, this.horizontalDimension, GradientStyle.colortoColor);
    }

    onMouseOverSquare(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.setpreviewColor(this.colorService.numeralToHex(this.colorService.getColor(position, this.squareCtx)));
    }

    onMouseOverSquareClick(event: MouseEvent): void {
        // palette
        if (this.colorService.isclicked) {
            this.colorService.setprimaryColor(this.colorService.getpreviewColor());
            this.colorService.addLastColor(this.colorService.getprimaryColor());
        } else {
            this.colorService.setsecondaryColor(this.colorService.getpreviewColor());
            this.colorService.addLastColor(this.colorService.getsecondaryColor());
        }
        this.drawSquarePalette(); // cursor
        this.drawOpacitySlider();
    }

    onMouseOverHorizontalClick(event: MouseEvent): void {
        // color slider
        if (this.colorService.isclicked) {
            this.colorService.setprimaryColor(this.colorService.getpreviewColor());
            this.colorService.addLastColor(this.colorService.getprimaryColor());
        } else {
            this.colorService.setsecondaryColor(this.colorService.getpreviewColor());
            this.colorService.addLastColor(this.colorService.getsecondaryColor());
        }
        this.colorService.setselectedColor(this.colorService.getpreviewColor()); // to update palette UI (primary + secondary).
        this.drawSquarePalette(); // updates the color palette
        this.drawHorizontalPalette(); // updates the color slider cursors' position
        this.drawOpacitySlider();
    }

    onMouseOverHorizontal(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.setpreviewColor(this.colorService.numeralToHex(this.colorService.getColor(position, this.horizontalCtx)));
    }

    onMouseOverOpacitySliderClick(event: MouseEvent): void {
        this.drawOpacitySlider();
        this.colorService.changeColorOpacity(this.findPositionSlider(event)); // change opacity via the slider.
    }
    onMouseLastColorClick(event: MouseEvent, clickedColor: LastColor): boolean {
        if (clickedColor.active) {
            if (MouseButton.Left === event.button) {
                this.colorService.setprimaryColor(clickedColor.color as string);
            } else if (MouseButton.Right === event.button) {
                this.colorService.setsecondaryColor(clickedColor.color as string);
                return false;
            }
        }
        return true;
    }
    // return the value between 0 to 1 of the opacity slider
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
            this.colorService.setprimaryColor(this.color);
            this.colorService.changeColorOpacity(rgb.alpha);
        } else {
            this.openWarningMessage(this.messageRGB);
        }
    }
    // tslint:disable-next-line:no-any
    openWarningMessage(templateRef: any): void {
        this.matDialog.open(templateRef, {
            width: '300px',
        });
    }
}
