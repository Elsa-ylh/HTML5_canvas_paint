import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';
import { DropperService } from '@app/services/tools/dropper.service';

@Component({
    selector: 'app-dropper-color',
    templateUrl: './dropper-color.component.html',
    styleUrls: ['./dropper-color.component.scss'],
})
export class DropperColorComponent implements AfterViewInit {
    @ViewChild('previewColor', { static: false }) previewColor: ElementRef<HTMLCanvasElement>;
    constructor(public colorService: ColorService, public dropperService: DropperService) {}

    circleCtx: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        this.circleCtx = this.previewColor.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.dropperService.circleCtx = this.circleCtx;
        this.setCircle();
    }
    setCircle(): void {
        this.dropperService.shapePreview('#ffffff');
    }
}
