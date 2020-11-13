import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '../drawing/drawing.service';
const KEY_SAVE_CANVAS = 'KeySaveCanvas';
const KEY_SAVE_WIDTH = 'KeySaveWidth';
const KEY_SAVE_HEIGHT = 'KeySaveHeight';
@Injectable({
    providedIn: 'root',
})
export class AutoSaveService {
    private myStorage: Storage;
    private canvas: string | null | undefined = '';
    private width: string | null | undefined = '';
    private height: string | null | undefined = '';

    constructor(private canvasResizer: CanvasResizerService, private drawingService: DrawingService) {
        this.myStorage = window.localStorage;
    }

    save(): void {
        this.myStorage.clear();
        const vec2: Vec2 = this.canvasResizer.canvasSize;
        this.myStorage.setItem(KEY_SAVE_CANVAS, this.drawingService.convertBaseCanvasToBase64());
        this.myStorage.setItem(KEY_SAVE_WIDTH, vec2.x.toString());
        this.myStorage.setItem(KEY_SAVE_HEIGHT, vec2.y.toString());
    }

    check(): boolean {
        this.canvas = this.myStorage.getItem(KEY_SAVE_CANVAS);
        this.width = this.myStorage.getItem(KEY_SAVE_WIDTH);
        this.height = this.myStorage.getItem(KEY_SAVE_HEIGHT);

        if (
            this.canvas === null ||
            this.canvas === undefined ||
            this.width === null ||
            this.width === undefined ||
            this.height === undefined ||
            this.height === null
        ) {
            return false;
        }
        return true;
    }

    getUpload(): boolean {
        if (!this.check()) {
            return false;
        }
        const widthNb = Number(this.width);
        const heightNb = Number(this.height);
        if (isNaN(widthNb) || isNaN(heightNb) || this.canvas === null || this.canvas === undefined) {
            return false;
        }
        this.drawingService.convertBase64ToBaseCanvas(this.canvas);
        this.canvasResizer.canvasSize.x = widthNb;
        this.canvasResizer.canvasSize.y = heightNb;

        return true;
    }
}
