import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Vec2 } from '@app/classes/vec2';
import { ColorService, GradientStyle } from '@app/services/color/color.service';

// certaines parties du code a ete inspiree de l'auteur
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
    width: number = 207;

    squareHeight: number = 200;
    horizontalHeight: number = 20;

    @ViewChild('previewSquare') previewSquare: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('squarePalette') squareCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewHorizontal') previewHorizontal: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('horizontalPalette') horizontalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('opacitySlider') opacitySliderCanvas: ElementRef<HTMLCanvasElement>; // to have an opacity slider
    @ViewChild('opacitySliderPreview') opacitySliderPreview: ElementRef<HTMLCanvasElement>; // to have an opacity slider

    squareDimension: Vec2 = { x: this.width, y: this.squareHeight };
    horizontalDimension: Vec2 = { x: this.width, y: this.horizontalHeight };

    previewSquareCtx: CanvasRenderingContext2D;
    squareCtx: CanvasRenderingContext2D;

    previewHorizontalCtx: CanvasRenderingContext2D;
    horizontalCtx: CanvasRenderingContext2D;

    opacitySliderCtx: CanvasRenderingContext2D;
    previewopacitySliderCtx: CanvasRenderingContext2D;
    cursorSquarePalette: any;

    constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, public colorService: ColorService) {
        this.iconRegistry.addSvgIcon('red', this.sanitizer.bypassSecurityTrustResourceUrl('assets/apple.svg'));
        this.iconRegistry.addSvgIcon('green', this.sanitizer.bypassSecurityTrustResourceUrl('assets/leaf.svg'));
        this.iconRegistry.addSvgIcon('blue', this.sanitizer.bypassSecurityTrustResourceUrl('assets/wave.svg'));
        this.iconRegistry.addSvgIcon('alpha', this.sanitizer.bypassSecurityTrustResourceUrl('assets/transparency.svg'));
        // for palette cursor
        this.cursorSquarePalette = new Image(1, 1);
        this.cursorSquarePalette.src = '/assets/cursorSquarePalette.svg';
        this.cursorSquarePalette.position = { x: 103, y: 103 };
        this.cursorSquarePalette.onload = function () {
            this.data1.drawImage(this.data2, this.position.x, this.position.y, 10, 10);
        };
        //this.cursorSquarePalette.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
    }

    ngAfterViewInit(): void {
        this.previewSquareCtx = this.previewSquare.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.squareCtx = this.squareCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewHorizontalCtx = this.previewHorizontal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.horizontalCtx = this.horizontalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewopacitySliderCtx = this.opacitySliderPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.opacitySliderCtx = this.opacitySliderCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawSquarePalette({ x: 103, y: 103 }); // x,y for palette cursor.
        this.drawHorizontalPalette();
        this.drawOpacitySlider();
    }
    // change between primary and sec
    primaryClick(): void {
        this.colorService.clickprimaryColor = true;
        this.colorService.clicksecondaryColor = false;
    }

    secondaryClick(): void {
        this.colorService.clickprimaryColor = false;
        this.colorService.clicksecondaryColor = true;
    }
    drawSquarePalette(position: any): void {
        this.colorService.drawPalette(this.squareCtx, this.squareDimension, GradientStyle.lightToDark);
        // cursor
        this.cursorSquarePalette.data1 = this.squareCtx;
        this.cursorSquarePalette.data2 = this.cursorSquarePalette;
        this.cursorSquarePalette.position = position;
        //Reset image
        this.cursorSquarePalette.src = '/assets/cursorSquarePalette.svg' + '#' + new Date().getTime();

        //this.squareCtx.drawImage(this.cursorSquarePalette, position.x, position.y, 10, 10);
    }

    drawHorizontalPalette(): void {
        this.colorService.drawPalette(this.horizontalCtx, this.horizontalDimension, GradientStyle.rainbow);
        // cursor
    }

    drawOpacitySlider(): void {
        this.colorService.drawPalette(this.opacitySliderCtx, this.horizontalDimension, GradientStyle.lightToDark);
        // cursor
    }

    onMouseOverSquare(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.setpreviewColor(this.colorService.numeralToHex(this.colorService.getColor(position, this.squareCtx)));
    }

    onMouseOverSquareClick(event: MouseEvent): void {
        // palette
        const position = { x: event.offsetX, y: event.offsetY };
        if (this.colorService.clickprimaryColor && this.colorService.clicksecondaryColor === false) {
            this.colorService.setprimaryColor(this.colorService.getpreviewColor());
        } else if (this.colorService.clicksecondaryColor && this.colorService.clickprimaryColor === false) {
            this.colorService.setsecondaryColor(this.colorService.getpreviewColor());
        }

        this.drawSquarePalette(position);
    }

    onMouseOverHorizontalClick(event: MouseEvent): void {
        //slider
        //const position = { x: event.offsetX, y: event.offsetY };
        if (this.colorService.clickprimaryColor && this.colorService.clicksecondaryColor === false) {
            this.colorService.setprimaryColor(this.colorService.getpreviewColor());
        } else if (this.colorService.clicksecondaryColor && this.colorService.clickprimaryColor === false) {
            this.colorService.setsecondaryColor(this.colorService.getpreviewColor());
        }
        this.colorService.setselectedColor(this.colorService.getpreviewColor());
        this.drawSquarePalette({ x: 103, y: 103 }); // updates the color palette
    }

    onMouseOverHorizontal(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.setpreviewColor(this.colorService.numeralToHex(this.colorService.getColor(position, this.horizontalCtx)));
    }
}
