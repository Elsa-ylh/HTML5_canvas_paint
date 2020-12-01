import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { STAMP } from '@app/classes/stamp';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent implements AfterViewInit {
    constructor(public stampService: StampService, public drawingService: DrawingService) {}

    @ViewChild('stamp1', { static: false }) stamp1Canvas: ElementRef<HTMLCanvasElement>;

    stamp1Ctx: CanvasRenderingContext2D;

    image1: HTMLImageElement;
    newWidth: number;
    newHeight: number;
    offSetX: number;
    offSetY: number;

    ngAfterViewInit(): void {
        this.stamp1Ctx = this.stamp1Canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.image1 = new Image();
        this.image1.src = STAMP.stamp1;
        this.image1.onload = () => {
            this.stamp1Ctx.drawImage(
                this.image1,
                0,
                0,
                this.image1.width,
                this.image1.height,
                0,
                0,
                this.stamp1Canvas.nativeElement.width,
                this.stamp1Canvas.nativeElement.height,
            );
        };
    }
}
