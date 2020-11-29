import { DrawingService } from '@app/services/drawing/drawing.service';
// import { SelectionImage } from './selection';
import { Vec2 } from './vec2';

export const CPSIZE = 10;

export enum ControlPointName {
    center = 0,
    left = 1,
    right = 2,
    top = 3,
    bottom = 4,
    topLeft = 5,
    topRight = 6,
    bottomLeft = 7,
    bottomRight = 8,
    none = 9,
}

export class ControlPoint {
    position: Vec2;
    drawingService: DrawingService;
    selected: boolean;
    // ellipseRadSign: Vec2;
    // sizeSign:Vec2;
    // imagePositionSign:Vec2;
    // endingPosSign:Vec2;

    constructor(drawingService: DrawingService) {
        this.drawingService = drawingService;
        this.selected = false;
        // this.ellipseRadSign = ellipseRadSign;
        // this.sizeSign = sizeSign;
        // this.imagePositionSign = imagePositionSign;
        // this.endingPosSign = endingPosSign;
    }

    draw(): void {
        this.drawingService.previewCtx.setLineDash([]);
        if (this.selected) {
            this.drawingService.previewCtx.fillStyle = '#FF0000';
        } else {
            this.drawingService.previewCtx.fillStyle = '#FFFFFF';
        }
        this.drawingService.previewCtx.strokeRect(this.position.x, this.position.y, CPSIZE, CPSIZE);
        this.drawingService.previewCtx.fillRect(this.position.x, this.position.y, CPSIZE, CPSIZE);
    }

    movePosition(movement: Vec2): void {
        this.position.x += movement.x;
        this.position.y += movement.y;
    }

    isInside(mouse: Vec2): boolean {
        if (mouse.x >= this.position.x && mouse.x <= this.position.x + CPSIZE && mouse.y >= this.position.y && mouse.y <= this.position.y + CPSIZE) {
            return true;
        }
        return false;
    }

    setPosition(position: Vec2): void {
        this.position = position;
    }

//     scale(selection:SelectionImage, movement:Vec2, shiftPressed:boolean):SelectionImage {

//       if( shiftPressed){
//         selection.ellipseRad.x += this.ellipseRadSign.x*movement.x;
//         selection.ellipseRad.y += this.ellipseRadSign.y*movement.y;
//         selection.width += this.sizeSign.x*movement.x * 2;
//         selection.height += this.sizeSign.y*movement.y * 2;
//         selection.endingPos.x += this.endingPosSign.x*movement.x;
//         selection.endingPos.y += this.endingPosSign.y*movement.y;
//         selection.imagePosition.x += this.imagePositionSign.x*movement.x;
//         selection.imagePosition.y += this.imagePositionSign.y*movement.y;
//         return selection;
//       }
//       selection.ellipseRad.x += this.ellipseRadSign.x*movement.x / 2;
//       selection.ellipseRad.y += this.ellipseRadSign.y*movement.y / 2;
//       selection.width += this.sizeSign.x*movement.x;
//       selection.height += this.sizeSign.y*movement.y;
//       selection.imagePosition.x += this.endingPosSign.x*movement.x;
//       selection.imagePosition.y += this.endingPosSign.y*movement.y;
//       selection.endingPos.x += this.imagePositionSign.x*movement.x;
//       selection.endingPos.y += this.imagePositionSign.y*movement.y;
//       return selection;

//     }
}
