import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})

export class TextService extends Tool {

  sizeFont: number = 0;
  colorFont: string = this.colorService.primaryColor;

  constructor(drawingService: DrawingService, private colorService: ColorService) {
    super(drawingService);
  }

  formatLabel(value: number): number {
    return value;
  }

}
