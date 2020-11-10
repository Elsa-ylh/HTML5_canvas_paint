import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    sizeFont: number = 0;
    fontStyle : string;
    colorFont: string = this.colorService.primaryColor;
    // tslint:disable-next-line:no-magic-numbers
    possibleSizeFont: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    // font size allowed for text -> autorized disable magical number
    possibleFont: string[] = ['Times New Roman', 'Calibri', 'Open Sans', 'Montserrat', 'Playfair Display'];
    mouseEnter: boolean = false;
    mouseOut: boolean = false;
    mousePosition: Vec2;
    canvasSelected: boolean;
    text_title : string = "Overlay text";
    imageLoader : HTMLElement | null = document.getElementById('imageLoader');
    img : HTMLImageElement = new Image();
    //imageLoader.addEventListener('change', handleImage, false);

    //xwindow.addEventListener('load', DrawPlaceholder)

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
    }

    formatLabel(value: number): number {
        return value;
    }

    onMouseDown(event: MouseEvent): void {
      this.mouseDown = event.button === MouseButton.Left;
      this.clearEffectTool();
      if (this.mouseEnter) {
          this.onMouseUp(event);
      }
      if (this.mouseDown) {
          this.mouseDownCoord = this.getPositionFromMouse(event);
      }
      this.mousePosition = this.mouseDownCoord;
  }

  onMouseUp(event: MouseEvent): void {
      if (this.mouseDown) {
          const mousePosition = this.getPositionFromMouse(event);
          this.mousePosition = mousePosition;
          this.canvasSelected = true;
        }
      }

  onMouseMove(event: MouseEvent): void {
      if (this.mouseDown) {
          const mousePosition = this.getPositionFromMouse(event);
          this.mousePosition = mousePosition;
          this.drawingService.clearCanvas(this.drawingService.previewCtx);
          this.canvasSelected = false;
      }
  }

  onMouseOut(event: MouseEvent): void {
      if (this.mouseDown) {
          this.mouseOut = true;
      }
  }

  onMouseEnter(event: MouseEvent): void {
      if (this.mouseOut) {
          this.mouseEnter = true;
      }
      this.mouseOut = false;
  }


 DrawOverlay(img : HTMLImageElement) : void {
    this.drawingService.previewCtx.fillStyle = 'rgba(30, 144, 255, 0.4)';
    this.drawingService.previewCtx.fillRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
}

 DrawText() : void {
  this.drawingService.baseCtx.fillStyle = "white";
  this.drawingService.baseCtx.textBaseline = 'middle';
  this.drawingService.baseCtx.font = "50px 'Montserrat'";
  this.drawingService.baseCtx.fillText(this.text_title, 50, 50);
}

// DynamicText(img : HTMLImageElement) : void {
//   let ctx : CanvasRenderingContext2D= this.drawingService.baseCtx;
//   ctx.canvas.addEventListener('keyup', function() {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     DrawOverlay(img);
//     DrawText();
//     text_title = this.value;
//     ctx.fillText(text_title, 50, 50);
//   });
// }

}
