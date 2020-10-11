import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DropperService extends Tool {
    rgba: RGBA;
    currentPosition: Vec2;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        if (event.button === MouseButton.Left) {
            this.mouseDown = false;
            const position = { x: event.offsetX, y: event.offsetY };
            this.rgba = this.colorService.getColor(position, this.drawingService.baseCtx);
            this.colorService.primaryColor = this.colorService.numeralToHex(this.rgba);
            this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;
            this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor;
        }
        if (event.button === MouseButton.Right) {
            this.mouseDown = false;
            const position = { x: event.offsetX, y: event.offsetY };
            this.rgba = this.colorService.getColor(position, this.drawingService.baseCtx);
            this.colorService.secondaryColor = this.colorService.numeralToHex(this.rgba);
        }
    }
}
