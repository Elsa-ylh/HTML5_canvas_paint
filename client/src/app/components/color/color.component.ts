import { Component, ElementRef, HostListener, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
// certaines parties du code a ete inspiree de l'auteur 
@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnChanges {

  @ViewChild('canvasSliderBar', { static: false }) sliderCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasPalette', { static: false }) paletteCanvas: ElementRef<HTMLCanvasElement>;

  constructor() { }

  private sliderCtx: CanvasRenderingContext2D;
  private paletteCtx: CanvasRenderingContext2D;
  private mouseDownSlider: boolean = false;
  private mouseDownPalette: boolean = false;
  private selectedHeight: number;

  //private color:string;
  private hue: string;

  public colorSlider: string;
  public colorPalette: string;
  public currentPositionPalette: { x: number; y: number };

  ngAfterViewInit() {
    this.sliderCtx = this.sliderCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.renderSlider();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hue']) {
      this.renderPalette();
      const position = this.currentPositionPalette;
      if (position) {
        this.colorSlider = this.getColorAtPositionPalette(position.x, position.y);
      }
    }
  }


  renderSlider() {

    const widthSlider = this.sliderCanvas.nativeElement.width;
    const heightSlider = this.sliderCanvas.nativeElement.height;

    this.sliderCtx.clearRect(0, 0, widthSlider, heightSlider);

    const gradient = this.sliderCtx.createLinearGradient(0, 0, 0, heightSlider);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    this.sliderCtx.beginPath();
    this.sliderCtx.rect(0, 0, widthSlider, heightSlider);

    this.sliderCtx.fillStyle = gradient;
    this.sliderCtx.fill();
    this.sliderCtx.closePath();

    if (this.selectedHeight) {
      this.sliderCtx.beginPath();
      this.sliderCtx.strokeStyle = 'white';
      this.sliderCtx.lineWidth = 5;
      this.sliderCtx.rect(0, this.selectedHeight - 5, widthSlider, 10);
      this.sliderCtx.stroke();
      this.sliderCtx.closePath();
    }
  }

  renderPalette(): void {
    if (!this.paletteCtx) {
      this.paletteCtx = this.paletteCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    const width = this.paletteCanvas.nativeElement.width;
    const height = this.paletteCanvas.nativeElement.height;

    this.paletteCtx.fillStyle = this.hue || 'rgba(255,255,255,1)';
    this.paletteCtx.fillRect(0, 0, width, height);

    const whiteGrad = this.paletteCtx.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    this.paletteCtx.fillStyle = whiteGrad;
    this.paletteCtx.fillRect(0, 0, width, height);

    const blackGrad = this.paletteCtx.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    this.paletteCtx.fillStyle = blackGrad;
    this.paletteCtx.fillRect(0, 0, width, height);

    if (this.currentPositionPalette) {
      this.paletteCtx.strokeStyle = 'white';
      this.paletteCtx.fillStyle = 'white';
      this.paletteCtx.beginPath();
      this.paletteCtx.arc(this.currentPositionPalette.x, this.currentPositionPalette.y, 10, 0, 2 * Math.PI);
      this.paletteCtx.lineWidth = 5;
      this.paletteCtx.stroke();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUpSlider(evt: MouseEvent) {
    this.mouseDownSlider = false;
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUpPalette(evt: MouseEvent) {
    this.mouseDownPalette = false;
  }


  onMouseDownSlider(evt: MouseEvent) {
    this.mouseDownSlider = true;
    this.selectedHeight = evt.offsetY;
    this.renderSlider();
    this.setColorSlider(evt.offsetX, evt.offsetY);
  }

  onMouseDownPalette(evt: MouseEvent) {
    this.mouseDownPalette = true;
    this.currentPositionPalette = { x: evt.offsetX, y: evt.offsetY };
    this.renderPalette();
    this.setColorPalette(evt.offsetX, evt.offsetY);
  }

  onMouseMoveSlider(evt: MouseEvent) {
    if (this.mouseDownSlider) {
      this.selectedHeight = evt.offsetY;
      this.renderSlider();
      this.setColorSlider(evt.offsetX, evt.offsetY);
    }
  }

  onMouseMovePalette(evt: MouseEvent) {
    if (this.mouseDownPalette) {
      this.selectedHeight = evt.offsetY;
      this.renderPalette();
      this.setColorPalette(evt.offsetX, evt.offsetY);
    }
  }

  setColorSlider(x: number, y: number) {
    this.colorSlider = this.getColorAtPositionSlider(x, y);
  }

  setColorPalette(x: number, y: number) {
    this.colorPalette = this.getColorAtPositionPalette(x, y);
  }

  getColorAtPositionSlider(x: number, y: number) {
    const imageData = this.sliderCtx.getImageData(x, y, 1, 1).data;
    return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  }

  getColorAtPositionPalette(x: number, y: number) {
    const imageData = this.paletteCtx.getImageData(x, y, 1, 1).data;
    return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  }

}
