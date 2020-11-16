import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Filter } from '@app/classes/filter';
import { ImageFormat } from '@app/classes/image-format';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-dialog-export-email',
    templateUrl: './dialog-export-email.component.html',
    styleUrls: ['./dialog-export-email.component.scss'],
})
export class DialogExportEmailComponent implements AfterViewInit {
    private whichExportType: ImageFormat = ImageFormat.PNG;
    private whichFilter: Filter = Filter.NONE;

    nameFormControl: FormControl;

    private filterString: Map<Filter, string> = new Map([
        [Filter.BLUR, 'blur(4px)'],
        [Filter.BRIGHTNESS, 'brightness(200)'],
        [Filter.GRAYSCALE, 'grayscale(100)'],
        [Filter.INVERT, 'invert(50)'],
        [Filter.SEPIA, 'sepia(50)'],
    ]);

    private imageFormatString: Map<ImageFormat, string> = new Map([
        [ImageFormat.PNG, '.png'],
        [ImageFormat.JPG, '.jpg'],
    ]);

    constructor(private drawingService: DrawingService) {
        this.nameFormControl = new FormControl('default', Validators.pattern('^[a-zA-Z]{1,63}$'));
    }

    @ViewChild('previewImage', { static: false }) previewImage: ElementRef<HTMLImageElement>;

    // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
    ngAfterViewInit(): void {
        this.previewImage.nativeElement.src = this.drawingService.convertBaseCanvasToBase64();
    }

    checkPNG(): void {
        this.whichExportType = ImageFormat.PNG;
    }

    checkJPG(): void {
        this.whichExportType = ImageFormat.JPG;
    }

    checkNone(): void {
        this.whichFilter = Filter.NONE;
        this.previewImage.nativeElement.style.filter = '';
    }
    checkFirst(): void {
        this.whichFilter = Filter.BLUR;
        this.previewImage.nativeElement.style.filter = 'blur(4px)';
    }

    checkSecond(): void {
        this.whichFilter = Filter.GRAYSCALE;
        this.previewImage.nativeElement.style.filter = 'grayscale(100)';
    }

    checkThird(): void {
        this.whichFilter = Filter.INVERT;
        this.previewImage.nativeElement.style.filter = 'invert(50)';
    }

    checkFourth(): void {
        this.whichFilter = Filter.BRIGHTNESS;
        this.previewImage.nativeElement.style.filter = 'brightness(200)';
    }

    checkFifth(): void {
        this.whichFilter = Filter.SEPIA;
        this.previewImage.nativeElement.style.filter = 'sepia(50)';
    }

    exportToEmail(): void {
        this.whichExportType;
        this.whichFilter;
        this.filterString;
        this.imageFormatString;
    }
}
