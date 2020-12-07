import { Injectable } from '@angular/core';
import { SelectionImage } from '@app/classes/selection';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection-service';
const FIFTEEN = 15;
const ONE = 1;
export const TO_RAD =  Math.PI / 180;

@Injectable({
    providedIn: 'root',
})
export class RotationService extends Tool {
    altPressed: boolean = false;
    isWheelAdd: boolean = false;
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onWheelScroll(selectionService: SelectionService, event: WheelEvent) {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.addOrRetract(event);
            selectionService.selection.rotationAngle = this.changeAngleWithScroll(selectionService.selection.rotationAngle);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            selectionService.drawSelection(selectionService.selection.imagePosition);
            // selectionService.selection.resetAngle();
        }
    }

    rotateSelection(selection: SelectionImage, ctx: CanvasRenderingContext2D): void {
        const angleInRadian = selection.rotationAngle * TO_RAD;
        ctx.translate(selection.imagePosition.x + selection.width / 2, selection.imagePosition.y + selection.height / 2);
        ctx.rotate(angleInRadian);
        ctx.translate(-selection.imagePosition.x - selection.width / 2, -selection.imagePosition.y - selection.height / 2);
    }

    changeAngleWithScroll(rotationAngle: number): number {
        if (this.isWheelAdd) {
            if (!this.altPressed) {
              return  rotationAngle += FIFTEEN;
            } else {
              return  rotationAngle += ONE;
            }
        } else {
            if (!this.altPressed) {
              return  rotationAngle -= FIFTEEN;
            } else {
              return  rotationAngle -= ONE;
            }
        }
    }

    addOrRetract(event: WheelEvent): void {
        // scroll up => wheel adds to the angle (same as when scrolling up a page.)
        // if the value of deltaY is <0 that means we are scrooling up
        if (event.deltaY < 0) {
            this.isWheelAdd = true;
        } else {
            this.isWheelAdd = false;
        }
    }

    // updateImageWithRotation(selectionService:SelectionService):void {
    //     const canvas = document.createElement('canvas') as HTMLCanvasElement;
    //     const ctx = (canvas.getContext('2d') as CanvasRenderingContext2D) as CanvasRenderingContext2D;
    //     //const ADDED_WIDTH = Math.abs(Math.sin(selectionService.selection.rotationAngle*TO_RAD)*selectionService.selection.width);
    //     //const ADDED_HEIGHT = Math.abs(Math.sin(selectionService.selection.rotationAngle*TO_RAD)*selectionService.selection.height);
    //     canvas.width = Math.abs(selectionService.baseSize.x );
    //     canvas.height = Math.abs(selectionService.baseSize.y);
    //     ctx.save();
    //     ctx.translate(canvas.width/2, canvas.height/2);
    //     ctx.rotate(selectionService.selection.rotationAngle * TO_RAD);
    //     ctx.translate(-canvas.width/2, -canvas.height/2);
    //     ctx.drawImage(selectionService.baseImage, canvas.width/2 - selectionService.selection.imageSize.x/2 , canvas.height/2 - selectionService.selection.imageSize.y/2);
    //     selectionService.selection.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //     ctx.restore();
    //     // selectionService.selection.imageSize = {x:selectionService.selection.width, y: selectionService.selection.height};
    //     // selectionService.selection.imagePosition = {x:selectionService.selection.imagePosition.x - ADDED_WIDTH/2, y:selectionService.selection.imagePosition.y - ADDED_HEIGHT/2};
    //     // selectionService.selection.imageSize = {x:selectionService.selection.width, y:selectionService.selection.height};
    //     // selectionService.selection.endingPos = {x:selectionService.selection.endingPos.x + ADDED_WIDTH/2, y:selectionService.selection.endingPos.y + ADDED_HEIGHT/2};
    //     selectionService.selection.image = new Image();
    //     selectionService.selection.image.src = selectionService.selection.getImageURL(selectionService.selection.imageData, canvas.width, canvas.height);
    //     console.log(canvas.width);
    //     //selectionService.selection.width = canvas.width;
    //     //selectionService.selection.height = canvas.height;
    // }
}
