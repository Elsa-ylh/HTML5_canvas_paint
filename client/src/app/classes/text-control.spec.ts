// import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { TextControl } from './text-control';

// tslint:disable:no-magic-numbers

describe('TextControl', () => {
    let previewStub: CanvasRenderingContext2D;
    let baseStub: CanvasRenderingContext2D;
    let textControl: TextControl;
    beforeEach(() => {
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        baseStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub.canvas.width = 100;
        previewStub.canvas.height = 100;
        textControl = new TextControl(previewStub);
        // baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create an instance', () => {
        expect(new TextControl(previewStub)).toBeTruthy();
    });

    it('should setWidth 50', () => {
        textControl.setWidth(50);
        expect(textControl['width']).toEqual(50);
    });

    it('should setCtx previewCtx', () => {
        textControl.setCtx(previewStub);
        expect(textControl['ctx']).toEqual(previewStub);
    });

    it('getFont should return Times New Roman', () => {
        const font = 'Times New Roman';
        let canvas: CanvasRenderingContext2D;
        canvas = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.font = font;
        textControl.setCtx(canvas);
        expect(textControl.getFont()).toEqual(font);
    });

    it('getText should return text', () => {
        const text = 'test';
        textControl.addLetter(text);
        expect(textControl.getText()).toEqual(text);
    });
    it('getTextWithCursor should return text', () => {
        const text = 'tests';
        textControl['textPreview'][0] = text;
        textControl.getText();
        expect(textControl.getText()).toEqual(text);
    });

    it('checkWidthText should return true if text size < width ', () => {
        const textOnCanvas = 'test';
        const width = 150;
        expect(textControl.checkWidthText(baseStub, textOnCanvas, width)).toEqual(true);
    });

    it('checkHeightText should return true', () => {
        const nbLine = 3;
        const sizeFont = 20;
        const height = 150;
        expect(textControl.checkHeightText(nbLine, sizeFont, height)).toEqual(true);
    });
});
