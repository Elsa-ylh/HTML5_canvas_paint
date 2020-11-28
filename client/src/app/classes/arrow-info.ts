import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection-service/selection-service';
import { Subscription, timer } from 'rxjs';
import { Vec2 } from './vec2';

export const PIXELMOUVEMENT = 3;
export const MOUVEMENTDELAY = 100;
export class ArrowInfo {
    constructor(private direction: Vec2, private drawingService: DrawingService, private selectionService: SelectionService) {
        this.timerStarted = false;
        this.arrowPressed = false;
        this.selectionService = selectionService;
        this.direction = direction;
        this.drawingService = drawingService;
    }
    arrowPressed: boolean;
    subscription: Subscription;
    timerStarted: boolean;

    onArrowDown(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            if (!this.selectionService.cleared) {
                this.selectionService.clearSelection(
                    this.selectionService.copyImageInitialPos,
                    this.selectionService.width,
                    this.selectionService.height,
                );
                this.selectionService.cleared = true;
            }
            if (!this.arrowPressed) {
                // first movement
                this.selectionService.mouseMovement.x = this.direction.x;
                this.selectionService.mouseMovement.y = this.direction.y;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.selectionService.imagePosition = {
                    x: this.selectionService.imagePosition.x + this.selectionService.mouseMovement.x,
                    y: this.selectionService.imagePosition.y + this.selectionService.mouseMovement.y,
                };
                this.selectionService.endingPos = {
                    x: this.selectionService.endingPos.x + this.selectionService.mouseMovement.x,
                    y: this.selectionService.endingPos.y + this.selectionService.mouseMovement.y,
                };
                this.selectionService.drawSelection(this.selectionService.imagePosition);
            }
            this.arrowPressed = true;
            this.selectionService.startTimer();
            // for continuous movement
            if (this.selectionService.time >= this.selectionService.minTimeMovement) {
                this.startMoveSelectionTimer();
            }
        }
    }

    startMoveSelectionTimer(): void {
        if (!this.timerStarted) {
            this.timerStarted = true;
            const timerMove = timer(MOUVEMENTDELAY, MOUVEMENTDELAY);

            this.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.selectionService.mouseMovement.x = this.direction.x;
                this.selectionService.mouseMovement.y = this.direction.y;
                this.selectionService.imagePosition = {
                    x: this.selectionService.imagePosition.x + this.selectionService.mouseMovement.x,
                    y: this.selectionService.imagePosition.y + this.selectionService.mouseMovement.y,
                };
                this.selectionService.endingPos = {
                    x: this.selectionService.endingPos.x + this.selectionService.mouseMovement.x,
                    y: this.selectionService.endingPos.y + this.selectionService.mouseMovement.y,
                };
                this.selectionService.drawSelection(this.selectionService.imagePosition);
            });
        }
    }

    onArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.arrowPressed = false;
            this.selectionService.resetTimer();
            if (this.timerStarted) {
                this.subscription.unsubscribe();
            }

            this.selectionService.mouseMovement = { x: 0, y: 0 };
            this.timerStarted = false;
        }
    }
}
