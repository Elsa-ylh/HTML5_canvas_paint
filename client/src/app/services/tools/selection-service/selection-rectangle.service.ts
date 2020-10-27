import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection-service';

@Injectable({
  providedIn: 'root'
})
export class SelectionRectangleService extends SelectionService {

  constructor(drawingService: DrawingService) {
    super(drawingService);
}

}
