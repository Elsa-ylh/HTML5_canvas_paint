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
    // tslint:disable-next-line:no-any
    cursorSquarePalette: any;

    previewHorizontalCtx: CanvasRenderingContext2D;
    horizontalCtx: CanvasRenderingContext2D;
    // tslint:disable-next-line:no-any
    cursorSliderColor: any;
    opacitySliderCtx: CanvasRenderingContext2D;
    previewopacitySliderCtx: CanvasRenderingContext2D;
    // tslint:disable-next-line:no-any
    cursorSliderOpacity: any;
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
        this.loadCursor();
    }

    ngAfterViewInit(): void {
        this.previewSquareCtx = this.previewSquare.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.squareCtx = this.squareCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewHorizontalCtx = this.previewHorizontal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.horizontalCtx = this.horizontalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewopacitySliderCtx = this.opacitySliderPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.opacitySliderCtx = this.opacitySliderCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawSquarePalette({ x: 103, y: 103 }); // x,y for palette cursor. initial pos.
        this.drawHorizontalPalette({ x: 10, y: 0 }); // x,y for color slider cursor. initial position.
        this.drawOpacitySlider({ x: 10, y: 0 });
    }

    loadCursor(): void {
        // cursor for palette cursor
        this.cursorSquarePalette = new Image(1, 1);
        this.cursorSquarePalette.src = '/assets/cursorSlider_Palette.svg';
        this.cursorSquarePalette.position = { x: 103, y: 103 };
        // tslint:disable-next-line:typedef
        this.cursorSquarePalette.onload = function () {
            // tslint:disable-next-line:no-magic-numbers
            this.data1.drawImage(this.data2, this.position.x, this.position.y, 15, 15); // pos, taille,taille
        };

        // cursor for color slider
        this.cursorSliderColor = new Image(1, 1);
        // tslint:disable-next-line:typedef
        this.cursorSliderColor.src = '/assets/cursorSlider_Palette.svg';
        this.cursorSliderColor.position = { x: 0, y: 0 };
        // tslint:disable-next-line:typedef
        this.cursorSliderColor.onload = function () {
            // tslint:disable-next-line:no-magic-numbers
            this.data1.drawImage(this.data2, this.position.x, 0, 20, 20);
        };

        // cursor for opacity slider
        // tslint:disable-next-line:typedef
        this.cursorSliderOpacity = new Image(1, 1);
        this.cursorSliderOpacity.src = '/assets/cursorSlider_Palette.svg';
        // tslint:disable-next-line:typedef
        this.cursorSliderOpacity.position = { x: 0, y: 0 };
        // tslint:disable-next-line:typedef
        this.cursorSliderOpacity.onload = function () {
            // tslint:disable-next-line:no-magic-numbers
            this.data1.drawImage(this.data2, this.position.x, 0, 20, 20);
        };
    }
    // change between primary and sec
    primaryClick(): void {
        this.colorService.isclicked = true;
    }
    secondaryClick(): void {
        this.colorService.isclicked = false;
    }

    // tslint:disable-next-line:no-any
    drawSquarePalette(positionPalette: any): void {
        this.colorService.drawPalette(this.squareCtx, this.squareDimension, GradientStyle.lightToDark);
        // we generate the cursor with the slider
        this.cursorSquarePalette.data1 = this.squareCtx;
        this.cursorSquarePalette.data2 = this.cursorSquarePalette;
        this.cursorSquarePalette.position = positionPalette;
        // Reset image
        // tslint:disable-next-line:no-any
        this.cursorSquarePalette.src = '/assets/cursorSlider_Palette.svg' + '#' + new Date().getTime();
    }
    // tslint:disable-next-line:no-any
    drawHorizontalPalette(positionSliderColor: any): void {
        this.colorService.drawPalette(this.horizontalCtx, this.horizontalDimension, GradientStyle.rainbow);
        // we generate the cursor with the slider
        this.cursorSliderColor.data1 = this.horizontalCtx;
        this.cursorSliderColor.data2 = this.cursorSliderColor;
        this.cursorSliderColor.position = positionSliderColor;
        // Reset image
        this.cursorSliderColor.src = '/assets/cursorSlider_Palette.svg' + '#' + new Date().getTime();
    }

    // tslint:disable-next-line:no-any
    drawOpacitySlider(positionSliderOpacity: any): void {
        // on cree la palette
        this.colorService.drawPalette(this.opacitySliderCtx, this.horizontalDimension, GradientStyle.colortoColor);
        // we generate the cursor with the slider
        this.cursorSliderOpacity.data1 = this.opacitySliderCtx;
        this.cursorSliderOpacity.data2 = this.cursorSliderColor;
        this.cursorSliderOpacity.position = positionSliderOpacity;
        // Reset image
        this.cursorSliderOpacity.src = '/assets/cursorSlider_Palette.svg' + '#' + new Date().getTime();
    }

    onMouseOverSquare(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.setpreviewColor(this.colorService.numeralToHex(this.colorService.getColor(position, this.squareCtx)));
    }

    onMouseOverSquareClick(event: MouseEvent): void {
        // palette
        const position = { x: event.offsetX, y: event.offsetY };
        if (this.colorService.isclicked) {
            this.colorService.setprimaryColor(this.colorService.getpreviewColor());
            this.colorService.addLastColor(this.colorService.getprimaryColor());
        } else {
            this.colorService.setsecondaryColor(this.colorService.getpreviewColor());
            this.colorService.addLastColor(this.colorService.getsecondaryColor());
        }
        this.drawSquarePalette(position); // cursor
    }

    onMouseOverHorizontalClick(event: MouseEvent): void {
        // color slider
        const positionSliderColorSlider = { x: event.offsetX, y: event.offsetY };
        if (this.colorService.isclicked) {
            this.colorService.setprimaryColor(this.colorService.getpreviewColor());
            this.colorService.addLastColor(this.colorService.getprimaryColor());
        } else {
            this.colorService.setsecondaryColor(this.colorService.getpreviewColor());
            this.colorService.addLastColor(this.colorService.getsecondaryColor());
        }
        this.colorService.setselectedColor(this.colorService.getpreviewColor()); // to update palette UI (primary + secondary).
        this.drawSquarePalette({ x: 103, y: 103 }); // updates the color palette
        this.drawHorizontalPalette(positionSliderColorSlider); // updates the color slider cursors' position
        this.drawOpacitySlider({ x: 0, y: 0 });
    }

    onMouseOverHorizontal(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.setpreviewColor(this.colorService.numeralToHex(this.colorService.getColor(position, this.horizontalCtx)));
    }

    onMouseOverOpacitySliderClick(event: MouseEvent): void {
        const mousePos = { x: event.offsetX, y: event.offsetY };
        this.drawOpacitySlider(mousePos);
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
