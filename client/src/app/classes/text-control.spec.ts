import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { TextControl } from './text-control';

// tslint:disable:prefer-const
// tslint:disable:no-magic-numbers

describe('TextControl', () => {
    let textControlStub: TextControl;
    //let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;
        //baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            declarations: [TextControl],
        });
    });
    textControlStub = TestBed.inject(TextControl);

    it('should be created', inject([TextControl], (textClass: TextControl) => {
        expect(textClass).toBeTruthy();
    }));

    it('checkWidthText should return true if text size < width ', () => {
        let textOnCanvas = 'test';
        const width = 10;
        expect(textControlStub.checkWidthText(previewStub, textOnCanvas, width)).toEqual(true);
    });

    it('checkWidthText should return true', () => {
        let nbLine = 3;
        let sizeFont = 20;
        const height = 10;
        expect(textControlStub.checkHeightText(nbLine, sizeFont, height)).toEqual(true);
    });
});
