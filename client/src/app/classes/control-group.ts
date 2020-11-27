import { DrawingService } from '@app/services/drawing/drawing.service';
import { ControlPoint, ControlPointName, CPSIZE } from './control-points';
import { Vec2 } from './vec2';

export class ControlGroup {
    drawingService: DrawingService;
    controlPointTop: ControlPoint;
    controlPointBottom: ControlPoint;
    controlPointLeft: ControlPoint;
    controlPointRight: ControlPoint;
    controlPointTopLeft: ControlPoint;
    controlPointTopRight: ControlPoint;
    controlPointBottomRight: ControlPoint;
    controlPointBottomLeft: ControlPoint;

    constructor(drawingService: DrawingService) {
        this.drawingService = drawingService;

        this.controlPointTopLeft = new ControlPoint(this.drawingService);
        this.controlPointTop = new ControlPoint(this.drawingService);
        this.controlPointTopRight = new ControlPoint(this.drawingService);

        this.controlPointLeft = new ControlPoint(this.drawingService);
        this.controlPointRight = new ControlPoint(this.drawingService);

        this.controlPointBottomRight = new ControlPoint(this.drawingService);
        this.controlPointBottom = new ControlPoint(this.drawingService);
        this.controlPointBottomLeft = new ControlPoint(this.drawingService);
    }

    draw(): void {
        this.controlPointTopLeft.draw();
        this.controlPointTop.draw();
        this.controlPointTopRight.draw();

        this.controlPointLeft.draw();
        this.controlPointRight.draw();

        this.controlPointBottomRight.draw();
        this.controlPointBottom.draw();
        this.controlPointBottomLeft.draw();
    }

    setPositions(startingPos: Vec2, endingPos: Vec2, size: Vec2): void {
        this.controlPointTopLeft.setPosition({ x: startingPos.x - CPSIZE / 2, y: startingPos.y - CPSIZE / 2 });
        this.controlPointTop.setPosition({ x: startingPos.x + size.x / 2 - CPSIZE / 2, y: startingPos.y - CPSIZE / 2 });
        this.controlPointTopRight.setPosition({ x: startingPos.x + size.x - CPSIZE / 2, y: startingPos.y - CPSIZE / 2 });

        this.controlPointLeft.setPosition({ x: startingPos.x - CPSIZE / 2, y: startingPos.y + size.y / 2 - CPSIZE / 2 });
        this.controlPointRight.setPosition({
            x: startingPos.x + size.x - CPSIZE / 2,
            y: startingPos.y + size.y / 2 - CPSIZE / 2,
        });

        this.controlPointBottomRight.setPosition({ x: endingPos.x - CPSIZE / 2, y: endingPos.y - CPSIZE / 2 });
        this.controlPointBottom.setPosition({ x: endingPos.x - size.x / 2 - CPSIZE / 2, y: endingPos.y - CPSIZE / 2 });
        this.controlPointBottomLeft.setPosition({ x: endingPos.x - size.x - CPSIZE / 2, y: endingPos.y - CPSIZE / 2 });
    }

    // tslint:disable:cyclomatic-complexity
    isInControlPoint(mouse: Vec2): ControlPointName {
        if (this.controlPointTopLeft.isInside(mouse)) {
            this.controlPointTopLeft.selected = true;
            this.controlPointTopLeft.draw();
            return ControlPointName.topLeft;
        }
        if (this.controlPointTop.isInside(mouse)) {
            this.controlPointTop.selected = true;
            this.controlPointTop.draw();
            return ControlPointName.top;
        }
        if (this.controlPointTopRight.isInside(mouse)) {
            this.controlPointTopRight.selected = true;
            this.controlPointTopRight.draw();
            return ControlPointName.topRight;
        }
        if (this.controlPointBottomRight.isInside(mouse)) {
            this.controlPointBottomRight.selected = true;
            this.controlPointBottomRight.draw();
            return ControlPointName.bottomRight;
        }
        if (this.controlPointBottom.isInside(mouse)) {
            this.controlPointBottom.selected = true;
            this.controlPointBottom.draw();
            return ControlPointName.bottom;
        }
        if (this.controlPointBottomLeft.isInside(mouse)) {
            this.controlPointBottomLeft.selected = true;
            this.controlPointBottomLeft.draw();
            return ControlPointName.bottomLeft;
        }
        if (this.controlPointLeft.isInside(mouse)) {
            this.controlPointLeft.selected = true;
            this.controlPointLeft.draw();
            return ControlPointName.left;
        }
        if (this.controlPointRight.isInside(mouse)) {
            this.controlPointRight.selected = true;
            this.controlPointRight.draw();
            return ControlPointName.right;
        }
        return ControlPointName.none;
    }

    resetSelected(): void {
        this.controlPointTopLeft.selected = false;
        this.controlPointTopRight.selected = false;
        this.controlPointTop.selected = false;

        this.controlPointLeft.selected = false;
        this.controlPointRight.selected = false;

        this.controlPointBottomLeft.selected = false;
        this.controlPointBottomRight.selected = false;
        this.controlPointBottom.selected = false;
    }
}
