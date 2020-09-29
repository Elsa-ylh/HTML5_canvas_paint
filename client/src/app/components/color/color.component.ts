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
    // Please tolerate such heresy
    width: number = 300;

    horizontalHeight: number = 150;
    squareHeight: number = 150;

    @ViewChild('previewSquare') previewSquare: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('squarePalette') squareCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewHorizontal') previewHorizontal: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('horizontalPalette') horizontalCanvas: ElementRef<HTMLCanvasElement>;

    squareDimension: Vec2 = { x: this.width, y: this.squareHeight };
    horizontalDimension: Vec2 = { x: this.width, y: this.horizontalHeight };

    previewSquareCtx: CanvasRenderingContext2D;
    squareCtx: CanvasRenderingContext2D;

    previewHorizontalCtx: CanvasRenderingContext2D;
    horizontalCtx: CanvasRenderingContext2D;

    constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private colorService: ColorService) {
        this.colorService.testMethod();
        this.iconRegistry.addSvgIcon('red', this.sanitizer.bypassSecurityTrustResourceUrl('assets/apple.svg'));
        this.iconRegistry.addSvgIcon('green', this.sanitizer.bypassSecurityTrustResourceUrl('assets/leaf.svg'));
        this.iconRegistry.addSvgIcon('blue', this.sanitizer.bypassSecurityTrustResourceUrl('assets/wave.svg'));
    }

    ngAfterViewInit(): void {
        this.previewSquareCtx = this.previewSquare.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.squareCtx = this.squareCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.previewHorizontalCtx = this.previewHorizontal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.horizontalCtx = this.horizontalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawSquarePalette();
        this.drawHorizontalPalette();
    }

    drawSquarePalette(): void {
        this.colorService.drawPalette(this.squareCtx, this.squareDimension, GradientStyle.rainbow);
    }

    drawHorizontalPalette(): void {
        this.colorService.drawPalette(this.horizontalCtx, this.horizontalDimension, GradientStyle.rainbow);
    }

    onClick(event: MouseEvent): void {
        debugger;
        this.colorService.drawDot(this.previewSquareCtx, this.squareDimension, event);
    }
}
