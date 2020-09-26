import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class ColorService extends Tool{

constructor(drawingService : DrawingService) {
  super(drawingService);

  
}

}
