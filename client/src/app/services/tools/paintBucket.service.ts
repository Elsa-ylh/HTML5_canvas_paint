import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
//import { ColorService } from '../color/color.service';
import { DrawingService } from '../drawing/drawing.service';
import { MouseButton } from '@app/classes/mouse-button';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
  providedIn: 'root'
})
export class PaintBucketService extends Tool {

  lineWidth: number = 1;
  fillColor: string;
  strokeColor: string;
  mousePosition: Vec2;
  mouseEnter: boolean = false;
  mouseOut: boolean = false;

  constructor(drawingService: DrawingService /*, private colorService: ColorService*/) {
    super(drawingService);
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    this.clearEffectTool();
    this.mouseDownCoord = this.getPositionFromMouse(event);
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
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
    this.mouseDown = false;
    this.mouseEnter = false;
    this.clearPath();
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      const mousePosition = this.getPositionFromMouse(event);
      this.mousePosition = mousePosition;

      // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
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

}
