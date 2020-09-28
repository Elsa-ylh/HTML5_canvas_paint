import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/tools/color-service';

// certaines parties du code a ete inspiree de l'auteur
@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})

// The following code has been highly inspired but not copied from this website
// https://malcoded.com/posts/angular-color-picker/
export class ColorComponent implements AfterViewInit {
    @ViewChild('roundPalette', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('horizontalPalette', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D;

    constructor(private colorService: ColorService) {
        this.colorService.fillHorizontalPalette(); // test method
    }

    ngAfterViewInit(): void {
        this.fillHorizontalPalette();
        this.fillRoundPalette();
    }

    fillRoundPalette(): void {}

    // slider
    fillHorizontalPalette(): void {
        this.ctx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.ctx.clearRect(0, 0, this.baseCanvas.nativeElement.width, this.baseCanvas.nativeElement.height);

        // creating the gradient
        const createGradient = this.ctx.createLinearGradient(0, 0, 0, this.baseCanvas.nativeElement.width);
        createGradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        createGradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        createGradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        createGradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        createGradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        createGradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        createGradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

        // draw the gradiant
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.baseCanvas.nativeElement.width, this.baseCanvas.nativeElement.height);
        this.ctx.fillStyle = createGradient;
        this.ctx.fill();
        this.ctx.closePath();
    }
}
