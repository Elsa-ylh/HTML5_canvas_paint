import { Component, HostListener } from '@angular/core';
import {DrawingService} from '@app/services/drawing/drawing.service';
import { MatDialog } from '@angular/material/dialog';
import {DialogNewDrawingComponent} from '../dialog-new-drawing/dialog-new-drawing.component'

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor (private drawingService: DrawingService,
    private dialog: MatDialog) {}

    openDialog() {
      this.dialog.open(DialogNewDrawingComponent);
    }

  // returns true if every pixel's uint32 representation is 0 (or "blank")
   isCanvasBlank() {

    const pixelBuffer = new Uint32Array(
    this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height).data.buffer);

    return !pixelBuffer.some(color => color !== 0);
  }

  clearCanvas() {
    if(!this.isCanvasBlank()){
      this.openDialog();
    }
  }

    //keybind control o for new drawing
  @HostListener('window:keydown', ['$event']) onKeyDown(e: any) {
    e.preventDefault();
    if (e.keyCode == 79 && e.ctrlKey) {
      this.clearCanvas();

    }
  }
}
