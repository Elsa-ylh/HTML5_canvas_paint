import { Component } from '@angular/core';
import {DrawingService} from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor (private drawingService: DrawingService) {}

  // returns true if every pixel's uint32 representation is 0 (or "blank")
   isCanvasBlank() {

    const pixelBuffer = new Uint32Array(
    this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height).data.buffer);

    return !pixelBuffer.some(color => color !== 0);
  }

  clearCanvas() {
    if(!this.isCanvasBlank()){
      //TODO Afficher alerte de confirmation
    }
    this.drawingService.clearCanvas(this.drawingService.baseCtx);
    this.drawingService.clearCanvas(this.drawingService.previewCtx);

  }
}
