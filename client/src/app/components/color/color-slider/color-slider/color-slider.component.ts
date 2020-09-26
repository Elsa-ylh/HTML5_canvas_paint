import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
    ngAfterViewInit(): void {}

    //@ViewChild('canvas');
    canvas: ElementRef<HTMLCanvasElement>;

    //@Output();
    //constructor() { }

    ngOnInit() {}
}
